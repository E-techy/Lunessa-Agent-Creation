// utils/performance_metrics_utility/create_performance_metrics.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create performance metrics object for a given username.
 * @param {string} username - The username of the agent.
 * @returns {Promise<object>} Performance metrics object.
 */
async function createPerformanceMetrics(username) {
  try {
    // 1️⃣ Find all agents with the given username
    const agents = await prisma.CustomerServiceAgents.findMany({
      where: { username },
    });

    if (!agents || agents.length === 0) {
      return { error: `No agent found for username: ${username}` };
    }

    // 2️⃣ Fetch companyAgentsRegistered only for this username
    const companyAgentsRegistered = await prisma.CompanyAgentsRegistered.findMany({
      where: { username },
    });

    // ✅ Get total agents and records linked to this username
    const agentRecord = companyAgentsRegistered.flatMap((rec) => rec.agents || []);
    const totalAgents = companyAgentsRegistered.reduce(
      (sum, rec) => sum + (rec.totalAgents || 0),
      0
    );

    // 3️⃣ Build metrics per agent
    const metricsForAllAgents = await Promise.all(
      agents.map(async (agent) => {
        const agentId = agent.agentId;

        // Fetch AgentUsageStatistics
        const usageStats = await prisma.AgentUsageStatistics.findUnique({
          where: { agentId },
        });

        // Fetch AgentRequestsHandledLogs
        const requestsHandled = await prisma.AgentRequestsHandledLogs.findUnique({
          where: { agentId },
        });

        return {
          agentBasicDetails: {
            agentId,
            agentName: agent.agentName,
            username: agent.username,
            companyName: agent.companyName,
            establishmentDate: agent.establishmentDate,
            companyOwnerName: agent.companyOwnerName,
            companyHumanServiceNumber: agent.companyHumanServiceNumber,
            companyEmail: agent.companyEmail,
            companyDescription: agent.companyDescription,
            availableTokens: agent.availableTokens,
            lastModified: agent.lastModified,
          },

          totalRequestsHandled: requestsHandled?.totalRequestsHandled || 0,

          requestHandledLogs: requestsHandled?.requestLogs || [],

          customerReviews: usageStats?.customerReviews || [],

          usageLogs: usageStats?.usageLogs || [], // ✅ token usage history

          satisfactionRate: usageStats?.satisfactionRate || 0,

          satisfactionRateLogs: usageStats?.satisfactionRateLogs || [],

          modificationHistory: agent.modificationHistory || [],
        };
      })
    );

    // 4️⃣ Final structured response
    return {
      username,
      totalAgents, // ✅ from CompanyAgentsRegistered.username
      agentRecord, // ✅ all registered agents for this username
      agents: metricsForAllAgents,
    };
  } catch (err) {
    console.error("Error in createPerformanceMetrics:", err);
    throw err;
  }
}

module.exports = createPerformanceMetrics;
