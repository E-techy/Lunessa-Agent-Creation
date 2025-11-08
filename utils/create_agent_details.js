// utils/create_agent_details.js

/**
 * Extract agent details from the request body and format them into a standardized object.
 *
 * This function ensures that incoming request body values are converted into
 * the correct format before being validated and passed to the addOrUpdateAgent function.
 *
 * - Converts date strings into Date objects
 * - Ensures arrays are always arrays (items, tokenBalances, modificationHistory)
 * - Defaults missing optional values to safe defaults
 *
 * @param {Object} req - Express request object.
 * @param {Object} req.body - The body of the request containing agent details.
 *
 * @returns {Object} agentDetails - The formatted agent details object.
 * @returns {string} agentDetails.companyName - Company name.
 * @returns {Date|null} agentDetails.establishmentDate - Date of company establishment.
 * @returns {string} agentDetails.companyOwnerName - Owner name of the company.
 * @returns {string} agentDetails.companyHumanServiceNumber - Customer service contact number.
 * @returns {string} agentDetails.companyEmail - Unique company email.
 * @returns {string} agentDetails.companyDescription - Company description.
 * @returns {string} agentDetails.agentId - Unique ID for the agent.
 * @returns {string} agentDetails.agentName - Agent’s name.
 * @returns {string} agentDetails.username - Username of the user creating/updating the agent.
 * @returns {Array<Object>} agentDetails.tokenBalances - Array of token balance objects.
 * @returns {Object|null} agentDetails.usingModel - Currently active model object.
 * @returns {Object|null} agentDetails.defaultModel - Default fallback model object.
 * @returns {Array<Object>} agentDetails.items - Array of items handled by the agent.
 * @returns {Date} agentDetails.lastModified - Last modification timestamp.
 * @returns {Array<Object>} agentDetails.modificationHistory - Agent modification history records.
 */
function createAgentDetails(req) {
  const body = req.body;

  // lastModified should not be taken from the body; it is set by the update logic.
  // We include a default Date just for validation if the body doesn't supply one,
  // but it will be overwritten in addOrUpdateAgent.
  const now = new Date();

  return {
    // Existing fields
    companyName: body.companyName || "",
    establishmentDate: body.establishmentDate ? new Date(body.establishmentDate) : null,
    companyOwnerName: body.companyOwnerName || "",
    companyHumanServiceNumber: body.companyHumanServiceNumber || "",
    companyEmail: body.companyEmail || "",
    companyDescription: body.companyDescription || "",
    agentId: body.agentId || "",
    agentName: body.agentName || "",
    username: body.username || "",
    items: Array.isArray(body.items) ? body.items : [],
    lastModified: body.lastModified ? new Date(body.lastModified) : now,

    // Token balances are managed by the update/create logic (fetched from DB, not request body)
    tokenBalances: [], 
    
    // Optional embedded types from request body (will be overwritten if agent exists)
    usingModel: body.usingModel && typeof body.usingModel === 'object' ? body.usingModel : null,

    defaultModel: body.defaultModel && typeof body.defaultModel === 'object' ? body.defaultModel : null,

    // modificationHistory is typically managed by the update logic
    modificationHistory: Array.isArray(body.modificationHistory) ? body.modificationHistory : [],
  };
}

module.exports = createAgentDetails;