// utils/add_new_agent.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createAgentDetails = require("./create_agent_details");
const validateAgentDetails = require("./validate_agent_details");
const createUniqueAgentId = require("./create_unique_agent_id");

/**
 * Create or update a Customer Service Agent record.
 *
 * Behavior:
 * - If `req.query.agentId` is NOT provided → **new agent**:
 *    → Generate a unique `agentId` using `username`, `agentName`, `secret`, and timestamp.
 *    → Validate details.
 *    → Create agent with empty `modificationHistory`.
 *
 * - If `req.query.agentId` IS provided → **update**:
 *    → Ensure agent exists.
 *    → Ensure immutable fields are not modified.
 *    → Validate details.
 *    → Save snapshot of old state to `modificationHistory`.
 *    → Update with new details + new `lastModified`.
 */
async function addOrUpdateAgent(req, secret) {
  const queryAgentId = req.query.agentId; // <-- main switch
  let agentDetails = createAgentDetails(req);

  if (!queryAgentId) {
    // --- Case 1: New Agent ---
    if (!agentDetails.agentId) {
      // Generate unique agentId
      agentDetails.agentId = createUniqueAgentId(
        agentDetails.username,
        agentDetails.agentName,
        secret
      );
    }

    // Validate details
    const validation = validateAgentDetails(agentDetails);
    if (!validation.valid) {
      throw new Error(`❌ Validation failed: ${validation.errors.join(", ")}`);
    }

    // Create agent
    const newAgent = await prisma.customerServiceAgents.create({
      data: {
        ...agentDetails,
        lastModified: new Date(),
        modificationHistory: [],
      },
    });

    return { status: "created", agent: newAgent };
  } else {
    // --- Case 2: Update Existing Agent ---
    const existingAgent = await prisma.customerServiceAgents.findUnique({
      where: { agentId: queryAgentId },
    });

    if (!existingAgent) {
      throw new Error(`❌ No agent found with ID: ${queryAgentId}`);
    }

    // Ensure immutables are unchanged
    if (
      (agentDetails.agentId && existingAgent.agentId !== agentDetails.agentId) ||
      (agentDetails.agentName && existingAgent.agentName !== agentDetails.agentName) ||
      (agentDetails.username && existingAgent.username !== agentDetails.username)
    ) {
      throw new Error("❌ Cannot modify agentId, agentName, or username.");
    }

    // Force correct agentId
    agentDetails.agentId = existingAgent.agentId;

    // Validate details
    const validation = validateAgentDetails(agentDetails);
    if (!validation.valid) {
      throw new Error(`❌ Validation failed: ${validation.errors.join(", ")}`);
    }

    // Snapshot old state
    const modificationSnapshot = {
      timestamp: new Date(),
      items: existingAgent.items,
      companyName: existingAgent.companyName,
      establishmentDate: existingAgent.establishmentDate,
      companyOwnerName: existingAgent.companyOwnerName,
      companyHumanServiceNumber: existingAgent.companyHumanServiceNumber,
      companyEmail: existingAgent.companyEmail,
      companyDescription: existingAgent.companyDescription,
    };

    // Update
    const updatedAgent = await prisma.customerServiceAgents.update({
      where: { agentId: queryAgentId },
      data: {
        ...agentDetails,
        lastModified: new Date(),
        modificationHistory: {
          push: modificationSnapshot,
        },
      },
    });

    return { status: "updated", agent: updatedAgent };
  }
}

module.exports = addOrUpdateAgent;
