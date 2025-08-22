const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch request handling logs for a specific agent belonging to a given username.
 *
 * Ensures that the agent belongs to the provided username before returning request handling logs.
 *
 * @async
 * @function getAgentRequestsHandled
 * @param {string} username - The username (owner of the agent).
 * @param {string} agentId - The unique identifier of the agent.
 * @returns {Promise<object>} An object containing:
 * - `username` {string} - The owner username.
 * - `agentId` {string} - The requested agent’s ID.
 * - `agentName` {string} - The name of the agent.
 * - `totalRequestsHandled` {number} - Total number of requests handled by this agent.
 * - `requestHandledLogs` {Array<object>} - Detailed logs of each request handled.
 *
 * @throws {Error} If the agent does not belong to the username or DB query fails.
 *
 * @example
 * const handled = await getAgentRequestsHandled("aman1234", "AG101");
 * console.log(handled);
 * // {
 * //   username: "aman1234",
 * //   agentId: "AG101",
 * //   agentName: "John Doe",
 * //   totalRequestsHandled: 57,
 * //   requestHandledLogs: [
 * //     { requestId: "REQ1", timestamp: "2025-08-21", status: "resolved" },
 * //     { requestId: "REQ2", timestamp: "2025-08-22", status: "pending" }
 * //   ]
 * // }
 */
async function getAgentRequestsHandled(username, agentId) {
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

    return {
      username,
      agentId: agent.agentId,
      agentName: agent.agentName,
      totalRequestsHandled: requestsHandled?.totalRequestsHandled || 0,
      requestHandledLogs: requestsHandled?.requestLogs || [],
    };
  } catch (err) {
    console.error("Error in getAgentRequestsHandled:", err);
    throw err;
  }
}

module.exports = getAgentRequestsHandled;
