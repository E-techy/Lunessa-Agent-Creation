// utils/add_new_agent.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createAgentDetails = require("./create_agent_details");
const validateAgentDetails = require("./validate_agent_details");
const createUniqueAgentId = require("./create_unique_agent_id");

/**
 * Fetches the default model configuration from the database.
 * @returns {Promise<{modelName: string, defaultTokens: number} | null>} Default model name and tokens, or null if not found.
 */
async function getDefaultModelConfig() {
  const defaultModelRecord = await prisma.DefaultModelNames.findFirst({
    // Fetch the first default model defined, assuming there is only one
  });

  if (defaultModelRecord && defaultModelRecord.modelName) {
    return {
      modelName: defaultModelRecord.modelName.modelName,
      defaultTokens: defaultModelRecord.defaultTokens,
    };
  }

  // Fallback if no configuration is found
  return null;
}

/**
 * Create or update a Customer Service Agent record.
 *
 * Behavior:
 * - If `req.query.agentId` is NOT provided → **new agent**:
 * → Generate a unique `agentId`.
 * → Fetch default model config (name, tokens).
 * → Initialize `tokenBalances` with the default model.
 * → Validate details.
 * → Create agent with initialized model fields and empty `modificationHistory`.
 *
 * - If `req.query.agentId` IS provided → **update**:
 * → Ensure agent exists.
 * → Ensure immutable fields are not modified.
 * → Validate details.
 * → Save snapshot of old state (including models/tokens) to `modificationHistory`.
 * → Update agent with new details, preserving existing token balances.
 *
 * @param {Object} req - Express request object.
 * @param {string} secret - Secret key for generating unique ID.
 * @returns {Promise<{status: 'created' | 'updated', agent: Object}>} The result status and the agent record.
 */
async function addOrUpdateAgent(req, secret) {
  const queryAgentId = req.query.agentId; // <-- main switch
  let agentDetails = createAgentDetails(req);
  const now = new Date();

  // --- Case 1: New Agent ---
  if (!queryAgentId) {
    if (!agentDetails.agentId) {
      // Generate unique agentId
      agentDetails.agentId = createUniqueAgentId(
        agentDetails.username,
        agentDetails.agentName,
        secret
      );
    }
    
    // ⭐ Fetch Default Model Config ⭐
    const defaultModelConfig = await getDefaultModelConfig();

    if (defaultModelConfig) {
      // Initialize default model and token balances for a new agent
      agentDetails.defaultModel = {
        modelName: defaultModelConfig.modelName,
        availableTokens: defaultModelConfig.defaultTokens,
      };

      // Set the default model as the initial entry in tokenBalances
      agentDetails.tokenBalances = [
        {
          modelName: defaultModelConfig.modelName,
          availableTokens: defaultModelConfig.defaultTokens,
          status: "active", // Initial default model is active
          createdAt: now,
          updatedAt: now,
        },
      ];
    } else {
        // Fallback or error handling if no default model is defined
        console.warn("No default model configuration found. Agent created without initial token balances.");
    }
    
    // Validate details (now containing model data if available)
    const validation = validateAgentDetails(agentDetails);
    if (!validation.valid) {
      throw new Error(`❌ Validation failed: ${validation.errors.join(", ")}`);
    }

    // Create agent
    const newAgent = await prisma.CustomerServiceAgents.create({
      data: {
        ...agentDetails,
        lastModified: now,
        modificationHistory: [],
      },
    });

    return { status: "created", agent: newAgent };
  } 
  
  // --- Case 2: Update Existing Agent ---
  else {
    const existingAgent = await prisma.CustomerServiceAgents.findUnique({
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
    
    // ⭐ Preserve Existing Model/Token Data (Do NOT use request body values) ⭐
    agentDetails.tokenBalances = existingAgent.tokenBalances || [];
    agentDetails.usingModel = existingAgent.usingModel || null;
    agentDetails.defaultModel = existingAgent.defaultModel || null;

    // Validate details (using preserved model data)
    const validation = validateAgentDetails(agentDetails);
    if (!validation.valid) {
      throw new Error(`❌ Validation failed: ${validation.errors.join(", ")}`);
    }

    // ⭐ Snapshot old state for modification history ⭐
    const modificationSnapshot = {
      timestamp: now,
      // Agent Details
      items: existingAgent.items,
      companyName: existingAgent.companyName,
      establishmentDate: existingAgent.establishmentDate,
      companyOwnerName: existingAgent.companyOwnerName,
      companyHumanServiceNumber: existingAgent.companyHumanServiceNumber,
      companyEmail: existingAgent.companyEmail,
      companyDescription: existingAgent.companyDescription,
      // Model/Token Details
      tokenBalances: existingAgent.tokenBalances,
      usingModel: existingAgent.usingModel,
      defaultModel: existingAgent.defaultModel,
    };

    // Update
    const updatedAgent = await prisma.CustomerServiceAgents.update({
      where: { agentId: queryAgentId },
      data: {
        ...agentDetails,
        // The tokenBalances, usingModel, and defaultModel fields are preserved from existingAgent
        // via the override above, ensuring tokens don't change on a detail update.
        lastModified: now,
        modificationHistory: {
          push: modificationSnapshot,
        },
      },
    });

    return { status: "updated", agent: updatedAgent };
  }
}

module.exports = addOrUpdateAgent;