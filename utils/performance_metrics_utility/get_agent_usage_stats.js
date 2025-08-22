const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch usage logs for a specific agent belonging to a given username.
 *
 * Ensures that the agent belongs to the provided username before returning usage logs.
 *
 * @async
 * @function getAgentUsageStats
 * @param {string} username - The username (owner of the agent).
 * @param {string} agentId - The unique identifier of the agent.
 * @param {"day"|"week"|"month"|"year"|"lifetime"} timeframe - The period for filtering logs.
 * @returns {Promise<object>} An object containing:
 * - `username` {string} - The owner username.
 * - `agentId` {string} - The requested agent’s ID.
 * - `agentName` {string} - The name of the agent.
 * - `usageLogs` {Array<object>} - Logs of token/query usage.
 *
 * @throws {Error} If the agent does not belong to the username or DB query fails.
 *
 * @example
 * const usageStats = await getAgentUsageStats("aman1234", "AG101", "week");
 * console.log(usageStats);
 * // {
 * //   username: "aman1234",
 * //   agentId: "AG101",
 * //   agentName: "John Doe",
 * //   usageLogs: [
 * //     { tokensUsed: 120, timestamp: "2025-08-22" },
 * //     { tokensUsed: 80, timestamp: "2025-08-21" }
 * //   ]
 * // }
 */
async function getAgentUsageStats(username, agentId, timeframe = "lifetime") {
  try {
    // 1️⃣ Verify ownership of agent
    const agent = await prisma.CustomerServiceAgents.findFirst({
      where: { username, agentId },
      select: { agentId: true, agentName: true },
    });

    if (!agent) {
      return { error: `No agent found with ID: ${agentId} for username: ${username}` };
    }

    // 2️⃣ Fetch usage stats (only usageLogs now)
    const usageStats = await prisma.AgentUsageStatistics.findUnique({
      where: { agentId },
      select: { usageLogs: true },
    });

    let logs = usageStats?.usageLogs || [];

    // 3️⃣ Apply timeframe filter
    const now = new Date();
    let cutoffDate;

    switch (timeframe) {
      case "day":
        cutoffDate = new Date(now.setHours(0, 0, 0, 0)); // today midnight
        logs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
        break;

      case "week":
        cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 6); // last 7 days (today included)
        cutoffDate.setHours(0, 0, 0, 0);
        logs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
        break;

      case "month":
        cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 27); // last 28 days
        cutoffDate.setHours(0, 0, 0, 0);
        logs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
        break;

      case "year":
        cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - 1);
        cutoffDate.setHours(0, 0, 0, 0);
        logs = logs.filter(log => new Date(log.timestamp) >= cutoffDate);
        break;

      case "lifetime":
      default:
        // no filtering, include all logs
        break;
    }

    return {
      username,
      agentId: agent.agentId,
      agentName: agent.agentName,
      usageLogs: logs,
    };
  } catch (err) {
    console.error("Error in getAgentUsageStats:", err);
    throw err;
  }
}

module.exports = getAgentUsageStats;
