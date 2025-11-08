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
    lastModified: body.lastModified ? new Date(body.lastModified) : new Date(),

    // ⭐ Added fields from Prisma Schema ⭐
    // tokenBalances is an array of embedded types
    tokenBalances: [],
    
    // usingModel is an optional embedded type (UsingModel?)
    // Note: If null is passed, Prisma might set it to an empty object or require all fields if not optional in the DB layer.
    // For safety, we only include it if present and well-formed in the body.
    usingModel: body.usingModel && typeof body.usingModel === 'object' ? body.usingModel : null,

    // defaultModel is an optional embedded type (DefaultModel?)
    defaultModel: body.defaultModel && typeof body.defaultModel === 'object' ? body.defaultModel : null,

    // modificationHistory is an array of embedded types, typically managed by the update logic
    modificationHistory: Array.isArray(body.modificationHistory) ? body.modificationHistory : [],
  };
}

module.exports = createAgentDetails;