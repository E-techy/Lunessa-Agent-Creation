// utils/performance_metrics_utility/get_agent_satisfaction.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Calculate satisfaction percentage from logs.
 * Each reviewStar (0–5) is converted to percentage (0–100).
 * @param {Array<{reviewStar: number, timestamp: string}>} logs - The satisfaction logs.
 * @returns {number} Average satisfaction percentage (0–100).
 */
function calculateSatisfactionRate(logs) {
  if (!logs || logs.length === 0) return 0;

  const total = logs.reduce((sum, log) => sum + (log.reviewStar / 5) * 100, 0);
  return Math.round(total / logs.length); // integer percentage
}

/**
 * Fetch customer satisfaction rate and logs for a specific agent belonging to a given username.
 *
 * Calculates satisfaction rate dynamically from review stars in logs.
 *
 * @async
 * @function getAgentSatisfactionStats
 * @param {string} username - The username (owner of the agent).
 * @param {string} agentId - The unique identifier of the agent.
 * @param {"day" | "week" | "month" | "year" | "lifetime"} timeframe - The timeframe filter.
 * @returns {Promise<object>} An object containing:
 * - `username` {string} - The owner username.
 * - `agentId` {string} - The agent’s ID.
 * - `agentName` {string} - The agent’s name.
 * - `satisfactionRate` {number} - Average satisfaction % (0–100).
 * - `satisfactionRateLogs` {Array<object>} - Filtered satisfaction logs based on timeframe.
 */
async function getAgentSatisfactionStats(username, agentId, timeframe = "lifetime") {
  try {
    // 1️⃣ Verify ownership of agent
    const agent = await prisma.CustomerServiceAgents.findFirst({
      where: { username, agentId },
      select: { agentId: true, agentName: true },
    });

    if (!agent) {
      return { error: `No agent found with ID: ${agentId} for username: ${username}` };
    }

    // 2️⃣ Fetch satisfaction logs
    const satisfactionStats = await prisma.AgentUsageStatistics.findUnique({
      where: { agentId },
      select: { satisfactionRateLogs: true },
    });

    let logs = satisfactionStats?.satisfactionRateLogs || [];

    // 3️⃣ Apply timeframe filter
    if (timeframe && timeframe !== "lifetime") {
      const now = new Date();
      let startDate;

      switch (timeframe) {
        case "day":
          startDate = new Date(now);
          startDate.setUTCHours(0, 0, 0, 0);
          break;
        case "week":
          startDate = new Date(now);
          startDate.setUTCDate(now.getUTCDate() - 6);
          startDate.setUTCHours(0, 0, 0, 0);
          break;
        case "month":
          startDate = new Date(now);
          startDate.setUTCDate(now.getUTCDate() - 27);
          startDate.setUTCHours(0, 0, 0, 0);
          break;
        case "year":
          startDate = new Date(now);
          startDate.setUTCFullYear(now.getUTCFullYear() - 1);
          startDate.setUTCHours(0, 0, 0, 0);
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        logs = logs.filter((log) => {
          const logDate = new Date(log.timestamp);
          return logDate >= startDate && logDate <= now;
        });
      }
    }

    // 4️⃣ Calculate satisfaction rate (average from review stars)
    const satisfactionRate = calculateSatisfactionRate(logs);

    // 5️⃣ Final structured response
    return {
      username,
      agentId: agent.agentId,
      agentName: agent.agentName,
      satisfactionRate, // percentage 0–100
      satisfactionRateLogs: logs,
    };
  } catch (err) {
    console.error("Error in getAgentSatisfactionStats:", err);
    throw err;
  }
}

module.exports = getAgentSatisfactionStats;

