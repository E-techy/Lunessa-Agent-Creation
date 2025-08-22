// const createAgentDetails = require("./utils/create_agent_details");
// const validateAgentDetails = require("./utils/validate_agent_details");

// // -------------------------------
// // ✅ Good Request Example
// // -------------------------------
// const goodReq = {
//   body: {
//     companyName: "Tech Solutions Pvt Ltd",
//     establishmentDate: "2015-08-15",
//     companyOwnerName: "Ramesh Kumar",
//     companyHumanServiceNumber: "+91-9876543210",
//     companyEmail: "support@techsolutions.com",
//     companyDescription: "We provide AI-driven customer support services.",
//     agentId: "AGT12345",
//     agentName: "Priya Sharma",
//     username: "adminUser",
//     items: [
//       {
//         itemName: "ChatBotX",
//         itemCode: "CBX-001",
//         itemInitialWorkingExplanation: "AI-powered chatbot for FAQs.",
//         itemRunningSteps: ["Initialize bot", "Train model", "Deploy"],
//         commonProblemsSolutions: [
//           { problem: "Bot not responding", solution: "Restart service" },
//         ],
//       },
//     ],
//     lastModified: "2025-08-20",
//   },
// };

// // Extract + Validate
// const goodAgentDetails = createAgentDetails(goodReq);
// const goodValidation = validateAgentDetails(goodAgentDetails);

// console.log("✅ Good Agent Details:", goodAgentDetails);
// console.log("✅ Good Validation Result:", goodValidation);

// // -------------------------------
// // ❌ Bad Request Example
// // -------------------------------
// const badReq = {
//   body: {
//     companyName: "", // ❌ Empty
//     establishmentDate: "invalid-date", // ❌ Not a valid date
//     companyOwnerName: "", // ❌ Empty
//     companyHumanServiceNumber: "", // ❌ Empty
//     companyEmail: "invalidEmail.com", // ❌ Invalid format
//     companyDescription: "", // ❌ Empty
//     agentId: "", // ❌ Empty
//     agentName: "", // ❌ Empty
//     username: "", // ❌ Empty
//     items: [
//       {
//         itemName: "", // ❌ Empty
//         itemCode: "", // ❌ Empty
//         itemInitialWorkingExplanation: "", // ❌ Empty
//         itemRunningSteps: "not-an-array", // ❌ Should be array
//         commonProblemsSolutions: "not-an-array", // ❌ Should be array
//       },
//     ],
//     lastModified: "not-a-date", // ❌ Invalid date
//   },
// };

// // Extract + Validate
// const badAgentDetails = createAgentDetails(badReq);
// const badValidation = validateAgentDetails(badAgentDetails);

// console.log("\n❌ Bad Agent Details:", badAgentDetails);
// console.log("❌ Bad Validation Result:", badValidation);


// const createUniqueAgentId = require("./utils/create_unique_agent_id");

// const username = "adminUser";
// const agentName = "Priya Sharma";
// const secret = "MY_SUPER_SECRET_KEY";

// const agentId = createUniqueAgentId(username, agentName, secret);

// console.log("Generated Agent ID:", agentId);

// require('dotenv').config();


// const jwt = require("jsonwebtoken");

// const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "super-secret-key";

// // Fake user data
// const userData = {
//   email: "aman@examples.com",
//   username: "aman1234",
//   name: "Aman Kumar",
//   gender: "male",
//   phone: "+911234567890",
//   dob: "2000-05-12T00:00:00.000+00:00",
//   nationality: "Indian",
//   address: "Ranchi, Jharkhand"
// };

// // Generate JWT
// const token = jwt.sign(userData, JWT_SECRET_KEY, { expiresIn: "30h" });

// console.log("✅ Fake JWT Token:\n", token);

// //


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFtYW5AZXhhbXBsZXMuY29tIiwidXNlcm5hbWUiOiJhbWFuMTIzNCIsIm5hbWUiOiJBbWFuIEt1bWFyIiwiZ2VuZGVyIjoibWFsZSIsInBob25lIjoiKzkxMTIzNDU2Nzg5MCIsImRvYiI6IjIwMDAtMDUtMTJUMDA6MDA6MDAuMDAwKzAwOjAwIiwibmF0aW9uYWxpdHkiOiJJbmRpYW4iLCJhZGRyZXNzIjoiUmFuY2hpLCBKaGFya2hhbmQiLCJpYXQiOjE3NTU3MjA5MjgsImV4cCI6MTc1NTgyODkyOH0.LcuMNJdFc1l2jfT4HWU8F-oMvyeiCihoIGAu103Yw_s


const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = "7xdP6EGzCqIrx4aAAQvHyvVfKxI9fkSdEyMyllB+uX8=";

const payload = {
  email: "aman@examples.com",
  username: "aman1234",
  name: "Aman Kumar",
  gender: "male",
  phone: "+911234567890",
  dob: "2000-05-12T00:00:00.000+00:00",
  nationality: "Indian",
  address: "Ranchi, Jharkhand",
};

const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "10d" });
console.log(token);
