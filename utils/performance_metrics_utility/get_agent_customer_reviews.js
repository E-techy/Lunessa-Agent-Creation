const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Fetch the latest 10 customer reviews for a given agent, paginated by timestamp.
 *
 * Ensures the agent belongs to the provided username before fetching reviews.
 *
 * @async
 * @function getAgentCustomerReviews
 * @param {string} username - The username (owner of the agent).
 * @param {string} agentId - The unique identifier of the agent.
 * @param {string|Date} startTimestamp - Starting point; fetch reviews older than this timestamp.
 * @returns {Promise<object>} An object containing:
 * - `username` {string} - The owner username.
 * - `agentId` {string} - The agent’s ID.
 * - `agentName` {string} - The agent’s name.
 * - `reviews` {Array<object>} - List of up to 10 reviews, each containing:
 *    - `username` {string} - The customer’s username.
 *    - `comment` {string} - The review text.
 *    - `reviewStar` {number} - Rating given (1–5).
 *    - `timestamp` {string} - ISO date string of when the review was submitted.
 *
 * @throws {Error} If agent not found for username or DB query fails.
 *
 * @example
 * const reviews = await getAgentCustomerReviews("aman1234", "AG101", "2025-08-21T18:00:00Z");
 * console.log(reviews);
 * // {
 * //   username: "aman1234",
 * //   agentId: "AG101",
 * //   agentName: "John Doe",
 * //   reviews: [
 * //     {
 * //       username: "medicare_priya_user1",
 * //       comment: "Amazing service! Highly recommend.",
 * //       reviewStar: 3,
 * //       timestamp: "2025-08-15T21:09:08.729+00:00"
 * //     },
 * //     {
 * //       username: "john_user12",
 * //       comment: "Very professional and polite.",
 * //       reviewStar: 5,
 * //       timestamp: "2025-08-14T12:40:22.125+00:00"
 * //     }
 * //   ]
 * // }
 */
async function getAgentCustomerReviews(username, agentId, startTimestamp) {
  try {
    // 1️⃣ Verify ownership of agent
    const agent = await prisma.CustomerServiceAgents.findFirst({
      where: { username, agentId },
      select: { agentId: true, agentName: true },
    });

    if (!agent) {
      return { error: `No agent found with ID: ${agentId} for username: ${username}` };
    }

    // 2️⃣ Fetch last 10 reviews older than the given timestamp
    const reviews = await prisma.AgentCustomerReviews.findMany({
      where: {
        agentId,
        timestamp: {
          lt: new Date(startTimestamp), // older than given timestamp
        },
      },
      orderBy: { timestamp: "desc" },
      take: 10,
      select: {
        username: true,
        comment: true,
        reviewStar: true,
        timestamp: true,
      },
    });

    return {
      username,
      agentId: agent.agentId,
      agentName: agent.agentName,
      reviews,
    };
  } catch (err) {
    console.error("Error in getAgentCustomerReviews:", err);
    throw err;
  }
}

module.exports = getAgentCustomerReviews;
