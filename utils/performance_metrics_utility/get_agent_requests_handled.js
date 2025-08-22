const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch request handling logs for a specific agent belonging to a given username.
 *
 * Ensures that the agent belongs to the provided username before returning request handling logs.
 * Supports timeframe filtering: day, week, month, year, lifetime.
 *
 * @async
 * @function getAgentRequestsHandled
 * @param {string} username - The username (owner of the agent).
 * @param {string} agentId - The unique identifier of the agent.
 * @param {"day"|"week"|"month"|"year"|"lifetime"} [timeframe="lifetime"] - Timeframe filter for request logs.
 * @returns {Promise<object>} An object containing:
 * - `username` {string} - The owner username.
 * - `agentId` {string} - The requested agent’s ID.
 * - `agentName` {string} - The name of the agent.
 * - `totalRequestsHandled` {number} - Total number of requests handled (after filtering).
 * - `requestHandledLogs` {Array<object>} - Detailed logs of each request handled.
 *
 * @throws {Error} If the agent does not belong to the username or DB query fails.
 *
 * @example
 * const handled = await getAgentRequestsHandled("aman1234", "AG101", "week");
 * console.log(handled);
 * // {
 * //   username: "aman1234",
 * //   agentId: "AG101",
 * //   agentName: "John Doe",
 * //   totalRequestsHandled: 15,
 * //   requestHandledLogs: [
 * //     { requestId: "REQ1", timestamp: "2025-08-19T10:05:00.000Z", status: "resolved" },
 * //     { requestId: "REQ2", timestamp: "2025-08-20T14:12:00.000Z", status: "pending" }
 * //   ]
 * // }
 */
async function getAgentRequestsHandled(username, agentId, timeframe = "lifetime") {
  try {
    // 1️⃣ Verify ownership of agent
    const agent = await prisma.CustomerServiceAgents.findFirst({
      where: { username, agentId },
      select: { agentId: true, agentName: true },
    });

    if (!agent) {
      return { error: `No agent found with ID: ${agentId} for username: ${username}` };
    }

    // 2️⃣ Fetch requests handled logs
    const requestsHandled = await prisma.AgentRequestsHandledLogs.findUnique({
      where: { agentId },
    });

    let logs = requestsHandled?.requestLogs || [];

    // 3️⃣ Apply timeframe filtering
    const now = new Date();
    let cutoffDate;

    switch (timeframe) {
      case "day":
        cutoffDate = new Date(now);
        cutoffDate.setUTCHours(0, 0, 0, 0);
        logs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
        break;

      case "week":
        cutoffDate = new Date(now);
        cutoffDate.setUTCDate(now.getUTCDate() - 6);
        cutoffDate.setUTCHours(0, 0, 0, 0);
        logs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
        break;

      case "month":
        cutoffDate = new Date(now);
        cutoffDate.setUTCDate(now.getUTCDate() - 27);
        cutoffDate.setUTCHours(0, 0, 0, 0);
        logs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
        break;

      case "year":
        cutoffDate = new Date(now);
        cutoffDate.setUTCFullYear(now.getUTCFullYear() - 1);
        cutoffDate.setUTCHours(0, 0, 0, 0);
        logs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
        break;

      case "lifetime":
      default:
        // keep all logs
        break;
    }

    return {
      username,
      agentId: agent.agentId,
      agentName: agent.agentName,
      totalRequestsHandled: logs.length,
      requestHandledLogs: logs,
    };
  } catch (err) {
    console.error("Error in getAgentRequestsHandled:", err);
    throw err;
  }
}

module.exports = getAgentRequestsHandled;
