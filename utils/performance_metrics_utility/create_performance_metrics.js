// utils/performance_metrics_utility/create_performance_metrics.js

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Create performance metrics object for a given username & agentId.
 * @param {string} username - The username of the agent owner.
 * @param {string} agentId - The agentId of the specific agent.
 * @returns {Promise<object>} Performance metrics object.
 */
async function createPerformanceMetrics(username, agentId) {
  try {
    // 1️⃣ Verify agent ownership
    const agent = await prisma.CustomerServiceAgents.findUnique({
      where: { agentId },
    });

    if (!agent) {
      return { error: `No agent found with agentId: ${agentId}` };
    }

    if (agent.username !== username) {
      return { error: `Agent ${agentId} does not belong to username: ${username}` };
    }

    // 2️⃣ Fetch performance data for this agentId
    const usageStats = await prisma.AgentUsageStatistics.findUnique({
      where: { agentId },
    });

    const requestsHandled = await prisma.AgentRequestsHandledLogs.findUnique({
      where: { agentId },
    });

    // 3️⃣ Build the agent object in the required format
    const agentMetrics = {
      agentBasicDetails: {
        agentId: agent.agentId,
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
        items: agent.items || [], // ✅ make sure items are included
        modificationHistory: agent.modificationHistory || [],
      },

      customerReviews: usageStats?.customerReviews || [],

      requestHandledLogs: requestsHandled?.requestLogs || [],

      satisfactionRate: usageStats?.satisfactionRate || 0,

      satisfactionRateLogs: usageStats?.satisfactionRateLogs || [],

      totalRequestsHandled: requestsHandled?.totalRequestsHandled || 0,

      usageLogs: usageStats?.usageLogs || [],
    };

    return agentMetrics;
  } catch (err) {
    console.error("Error in createPerformanceMetrics:", err);
    throw err;
  }
}

module.exports = createPerformanceMetrics;
