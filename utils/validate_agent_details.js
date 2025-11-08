// utils/validate_agent_details.js

/**
 * Validate agent details for creating or updating a customer service agent.
 *
 * This function ensures that all required fields are present and correctly formatted
 * before saving or updating agent information in the database.
 *
 * Required fields include:
 * - companyName (string, non-empty)
 * - establishmentDate (valid Date)
 * - companyOwnerName (string, non-empty)
 * - companyHumanServiceNumber (string, non-empty)
 * - companyEmail (valid email format, non-empty)
 * - companyDescription (string, non-empty)
 * - agentId (string, non-empty)
 * - agentName (string, non-empty)
 * - username (string, non-empty)
 * - items (array with required fields inside)
 * - lastModified (valid Date)
 *
 * @param {Object} agentDetails - The details of the agent.
 * @param {string} agentDetails.companyName - Name of the company.
 * @param {Date|string} agentDetails.establishmentDate - Date of company establishment.
 * @param {string} agentDetails.companyOwnerName - Full name of the company owner.
 * @param {string} agentDetails.companyHumanServiceNumber - Customer service contact number.
 * @param {string} agentDetails.companyEmail - Unique company email address.
 * @param {string} agentDetails.companyDescription - Description about the company.
 * @param {string} agentDetails.agentId - Unique identifier for the agent.
 * @param {string} agentDetails.agentName - Name of the agent.
 * @param {string} agentDetails.username - Username of the account holder creating/updating the agent.
 * @param {Array} agentDetails.items - List of items managed by the agent.
 * @param {Date|string} agentDetails.lastModified - Date when the agent details were last modified.
 *
 * Each item inside `items` must include:
 * - itemName (string, non-empty)
 * - itemCode (string, non-empty)
 * - itemInitialWorkingExplanation (string, non-empty)
 * - itemRunningSteps (array)
 * - commonProblemsSolutions (array)
 *
 * @returns {Object} Validation result
 * @returns {boolean} result.valid - True if all validations pass, false otherwise.
 * @returns {string[]} result.errors - Array of error messages if validation fails.
 */
function validateAgentDetails(agentDetails) {
  const errors = [];

  // --- Required String Fields ---
  if (!agentDetails.companyName || agentDetails.companyName.trim() === "") {
    errors.push("companyName is required and cannot be empty.");
  }

  if (!agentDetails.companyOwnerName || agentDetails.companyOwnerName.trim() === "") {
    errors.push("companyOwnerName is required and cannot be empty.");
  }

  if (!agentDetails.companyHumanServiceNumber || agentDetails.companyHumanServiceNumber.trim() === "") {
    errors.push("companyHumanServiceNumber is required and cannot be empty.");
  }

  if (!agentDetails.companyEmail || agentDetails.companyEmail.trim() === "") {
    errors.push("companyEmail is required and cannot be empty.");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentDetails.companyEmail)) {
    errors.push("companyEmail must be a valid email address.");
  }

  if (!agentDetails.companyDescription || agentDetails.companyDescription.trim() === "") {
    errors.push("companyDescription is required and cannot be empty.");
  }

  if (!agentDetails.agentId || agentDetails.agentId.trim() === "") {
    errors.push("agentId is required and cannot be empty.");
  }

  if (!agentDetails.agentName || agentDetails.agentName.trim() === "") {
    errors.push("agentName is required and cannot be empty.");
  }

  if (!agentDetails.username || agentDetails.username.trim() === "") {
    errors.push("username is required and cannot be empty.");
  }

  // --- Date Validation ---
  if (!agentDetails.establishmentDate || isNaN(new Date(agentDetails.establishmentDate).getTime())) {
    errors.push("establishmentDate must be a valid date.");
  }

  if (!agentDetails.lastModified || isNaN(new Date(agentDetails.lastModified).getTime())) {
    errors.push("lastModified must be a valid date.");
  }

  // --- Items Validation ---
  if (!Array.isArray(agentDetails.items)) {
    errors.push("items must be an array.");
  } else {
    agentDetails.items.forEach((item, idx) => {
      if (!item.itemName || item.itemName.trim() === "") {
        errors.push(`items[${idx}].itemName is required and cannot be empty.`);
      }
      if (!item.itemCode || item.itemCode.trim() === "") {
        errors.push(`items[${idx}].itemCode is required and cannot be empty.`);
      }
      if (!item.itemInitialWorkingExplanation || item.itemInitialWorkingExplanation.trim() === "") {
        errors.push(`items[${idx}].itemInitialWorkingExplanation is required and cannot be empty.`);
      }
      if (!Array.isArray(item.itemRunningSteps)) {
        errors.push(`items[${idx}].itemRunningSteps must be an array.`);
      }
      if (!Array.isArray(item.commonProblemsSolutions)) {
        errors.push(`items[${idx}].commonProblemsSolutions must be an array.`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = validateAgentDetails;