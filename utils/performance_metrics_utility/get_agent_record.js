const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Get registered agent records for a username
 */
async function getAgentRecord(username) {
  try {
    const companyAgentsRegistered = await prisma.CompanyAgentsRegistered.findMany({
      where: { username },
      select: {
        agents: true,
        totalAgents: true,
      },
    });

    if (!companyAgentsRegistered || companyAgentsRegistered.length === 0) {
      return { error: `No records found for username: ${username}` };
    }

    const agentRecord = companyAgentsRegistered.flatMap(rec => rec.agents || []);
    const totalAgents = companyAgentsRegistered.reduce(
      (sum, rec) => sum + (rec.totalAgents || 0),
      0
    );

    return {
      username,
      totalAgents,
      agentRecord,
    };
  } catch (err) {
    console.error("Error in getAgentRecord:", err);
    throw err;
  }
}

module.exports = getAgentRecord;
