/**
 * Generate a unique agent ID using username, agentName, current time, and a secret.
 *
 * @param {string} username - The username of the person creating/updating the agent
 * @param {string} agentName - The name of the agent
 * @param {string} secret - A secret key stored securely on the server
 * @returns {string} - A unique hashed agentId
 */

const crypto = require("crypto");

function createUniqueAgentId(username, agentName, secret) {
  if (!username || !agentName || !secret) {
    throw new Error("username, agentName, and secret are required to generate agentId.");
  }

  const timestamp = Date.now().toString();

  // Raw string for hashing
  const rawString = `${username}:${agentName}:${timestamp}:${secret}`;

  // Create a SHA256 hash
  const hash = crypto.createHash("sha256").update(rawString).digest("hex");

  // To make ID shorter & easier to use, take first 16 chars of hash
  const agentId = `AGT-${hash.substring(0, 16)}`;

  return agentId;
}

module.exports = createUniqueAgentId;
