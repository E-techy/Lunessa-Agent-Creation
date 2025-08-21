/**
 * Utility function to delete an agent and all their related records from the database.
 *
 * This function performs the following:
 * 1. Finds the agent in `CustomerServiceAgents` using `agentId`.
 * 2. Verifies that the `username` matches.
 * 3. If valid, deletes all related records:
 *    - CustomerServiceAgents
 *    - AgentUsageStatistics
 *    - AgentRequestsHandledLogs
 *    - Removes agent from CompanyAgentsRegistered.agents array
 *
 * @module utils/delete_agent
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Delete an agent and all their related data.
 *
 * @async
 * @function deleteAgent
 * @param {string} username - The username of the agent owner.
 * @param {string} agentId - The unique agent ID to be deleted.
 * @returns {Promise<{ success: boolean, message: string }>}
 *
 * @example
 * const result = await deleteAgent("aman1234", "agent-001");
 * console.log(result);
 * // { success: true, message: "Agent and related data deleted successfully." }
 */
async function deleteAgent(username, agentId) {
  try {
    // 1️⃣ Check if agent exists and username matches
    const agent = await prisma.CustomerServiceAgents.findUnique({
      where: { agentId },
    });

    if (!agent) {
      return { success: false, message: "Agent not found." };
    }

    if (agent.username !== username) {
      return { success: false, message: "Username does not match agent record." };
    }

    // 2️⃣ Delete from CustomerServiceAgents
    await prisma.CustomerServiceAgents.delete({
      where: { agentId },
    });

    // 3️⃣ Delete from AgentUsageStatistics
    await prisma.AgentUsageStatistics.deleteMany({
      where: { agentId },
    });

    // 4️⃣ Delete from AgentRequestsHandledLogs
    await prisma.AgentRequestsHandledLogs.deleteMany({
      where: { agentId },
    });

    // 5️⃣ Remove from CompanyAgentsRegistered.agents[]
    await prisma.CompanyAgentsRegistered.updateMany({
      data: {
        agents: {
          set: [], // reset, then add back without this agent
        },
      },
    });

    // ⚡ Rebuild agents array excluding deleted one
    const allCompanies = await prisma.CompanyAgentsRegistered.findMany();
    for (const company of allCompanies) {
      const updatedAgents = company.agents.filter(a => a.agentId !== agentId);
      await prisma.CompanyAgentsRegistered.update({
        where: { id: company.id },
        data: { agents: updatedAgents },
      });
    }

    return { success: true, message: "Agent and related data deleted successfully." };
  } catch (error) {
    console.error("❌ Error deleting agent:", error);
    return { success: false, message: "Error deleting agent." };
  } finally {
    await prisma.$disconnect();
  }
}

module.exports =  deleteAgent;
