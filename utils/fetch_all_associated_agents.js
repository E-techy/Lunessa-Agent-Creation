const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch all Customer Service Agents associated with a given username.
 *
 * @param {string} username - The username whose agents need to be fetched.
 * @returns {Promise<{ agentsList: Array }>} - List of all associated agents.
 */
async function fetchAllAssociatedAgents(username) {

  try {
    const agentsList = await prisma.CustomerServiceAgents.findMany({
      where: { username },
      orderBy: { lastModified: "desc" }, // Most recently updated agents first
    });

    return { agentsList };
  } catch (err) {
    console.error("❌ Error fetching agents for username:", username, err);
    throw new Error("Failed to fetch associated agents.");
  }
}

module.exports = fetchAllAssociatedAgents;
