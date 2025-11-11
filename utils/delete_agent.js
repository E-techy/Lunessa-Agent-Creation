/**
 * Utility function to delete an agent and all their related records from the database.
 * This function uses a Prisma transaction to ensure that all deletions either succeed
 * together or fail and roll back together (atomicity).
 *
 * @module utils/delete_agent
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Delete an agent and all their related data using a transaction.
 *
 * @async
 * @function deleteAgent
 * @param {string} username - The username of the agent owner.
 * @param {string} agentId - The unique agent ID to be deleted.
 * @returns {Promise<{ success: boolean, message: string }>}
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
      return { success: false, message: "Username does not match agent record or agent does not belong to this user." };
    }

    // 2️⃣ Fetch the CompanyAgentsRegistered record to prepare for the array update
    const companyRecord = await prisma.CompanyAgentsRegistered.findUnique({
      where: { username: username }
    });

    if (!companyRecord) {
      // It's crucial for the transaction that we only proceed if all prerequisite data exists
      return { success: false, message: "Associated company registration record not found." };
    }

    // Filter out the deleted agent from the agents array BEFORE the transaction starts
    const updatedAgents = companyRecord.agents.filter(a => a.agentId !== agentId);
    const agentWasPresent = companyRecord.agents.length !== updatedAgents.length;

    if (!agentWasPresent) {
        console.warn(`Agent ${agentId} was not found in the CompanyAgentsRegistered list for user ${username}. Proceeding with agent deletion from other models.`);
    }

    // 3️⃣ Use Prisma interactive transaction for atomicity across models
    await prisma.$transaction(async (tx) => {
      // 3.1 Delete from CustomerServiceAgents
      await tx.CustomerServiceAgents.delete({
        where: { agentId },
      });

      // 3.2 Delete from AgentUsageStatistics
      // Using deleteMany because these are non-unique related records
      await tx.AgentUsageStatistics.deleteMany({
        where: { agentId },
      });

      // 3.3 Delete from AgentRequestsHandledLogs
      await tx.AgentRequestsHandledLogs.deleteMany({
        where: { agentId },
      });

      // 3.4 Update CompanyAgentsRegistered (This is the critical step that needed atomicity)
      await tx.CompanyAgentsRegistered.update({
        where: { username: username },
        data: {
          agents: updatedAgents, // Set the filtered array
          totalAgents: {
            // Decrement totalAgents only if the agent was found and removed in the array check
            decrement: agentWasPresent ? 1 : 0
          }
        },
      });
      // If any of the operations above fail, the transaction (tx) will roll back, 
      // automatically restoring the deleted CustomerServiceAgents record.
    });

    return { success: true, message: "Agent and all related data deleted successfully." };
  } catch (error) {
    console.error("❌ Error deleting agent (Transaction failed):", error);
    
    // Check for specific Prisma errors
    if (error.code === 'P2025') {
        return { success: false, message: `Deletion failed: One or more records were not found. Details: ${error.meta.cause}` };
    }
    
    return { success: false, message: "An error occurred during agent deletion. All changes were rolled back." };
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = deleteAgent;