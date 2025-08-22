const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch modification history for a specific agent belonging to a given username.
 *
 * Ensures that the requested agentId is owned by the provided username before returning data.
 *
 * @async
 * @function getModificationHistory
 * @param {string} username - The username (company owner) requesting the data.
 * @param {string} agentId - The unique identifier of the agent whose modification history is requested.
 * @returns {Promise<object>} An object containing:
 * - `username` {string} - The owner username.
 * - `agentId` {string} - The requested agent’s ID.
 * - `agentName` {string} - The name of the agent.
 * - `modificationHistory` {Array<string>} - List of modification logs for the agent.
 *
 * @throws {Error} If the database query fails.
 *
 * @example
 * const history = await getModificationHistory("aman1234", "AG101");
 * console.log(history);
 * // {
 * //   username: "aman1234",
 * //   agentId: "AG101",
 * //   agentName: "John Doe",
 * //   modificationHistory: ["Updated profile", "Changed department"]
 * // }
 */
async function getModificationHistory(username, agentId) {
  try {
    const agent = await prisma.CustomerServiceAgents.findFirst({
      where: {
        username, // ✅ ensure the agent belongs to this user
        agentId,
      },
      select: {
        agentId: true,
        agentName: true,
        username: true,
        modificationHistory: true,
      },
    });

    if (!agent) {
      return { error: `No agent found with ID: ${agentId} for username: ${username}` };
    }

    return {
      username: agent.username,
      agentId: agent.agentId,
      agentName: agent.agentName,
      modificationHistory: agent.modificationHistory || [],
    };
  } catch (err) {
    console.error("Error in getModificationHistory:", err);
    throw err;
  }
}

module.exports = getModificationHistory;
