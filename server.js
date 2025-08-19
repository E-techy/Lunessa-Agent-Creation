const express = require("express");
const addOrUpdateAgent = require('./utils/add_new_agent');

const app = express();
require('dotenv').config();

const PORT = process.env.AGENT_CREATION_PORT || 3002 ;
const secret = process.env.AGENT_ID_CREATION_SECRET || "your-secret-for-creating-agent-id";

app.use(express.static(__dirname+"/Agent_Details_Creation_UI"));

// Middleware to parse JSON
app.use(express.json());

// Simple route
app.get("/create_new_agent", (req, res) => {
  res.sendFile(__dirname+"/Agent_Details_Creation_UI/company_agent_detail.html");
});

app.post("/create_new_agent", async (req, res)=>{
    // authenticate user 

    // add new agent
    const result = await addOrUpdateAgent(req, secret);
    console.log(result);
    res.send(result);
    
})

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}/create_new_agent`);
});
