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
 * @returns {Promise<object>} An object containing:
 * - `username` {string} - The owner username.
 * - `agentId` {string} - The requested agent’s ID.
 * - `agentName` {string} - The name of the agent.
 * - `usageLogs` {Array<object>} - Logs of token/query usage.
 *
 * @throws {Error} If the agent does not belong to the username or DB query fails.
 *
 * @example
 * const usageStats = await getAgentUsageStats("aman1234", "AG101");
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
async function getAgentUsageStats(username, agentId) {
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
      select: { usageLogs: true }, // 👈 restrict to usageLogs only
    });

    return {
      username,
      agentId: agent.agentId,
      agentName: agent.agentName,
      usageLogs: usageStats?.usageLogs || [],
    };
  } catch (err) {
    console.error("Error in getAgentUsageStats:", err);
    throw err;
  }
}

module.exports = getAgentUsageStats;
