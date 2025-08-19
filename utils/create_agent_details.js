/**
 * Extract agent details from the request body and format them into a standardized object.
 *
 * This function ensures that incoming request body values are converted into
 * the correct format before being validated and passed to the addOrUpdateAgent function.
 *
 * - Converts date strings into Date objects
 * - Ensures items is always an array
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
 * @returns {Array} agentDetails.items - Array of items handled by the agent.
 * @returns {Date} agentDetails.lastModified - Last modification timestamp.
 */
function createAgentDetails(req) {
  const body = req.body;

  return {
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
  };
}

module.exports = createAgentDetails;
