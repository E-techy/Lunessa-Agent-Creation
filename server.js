const express = require("express");
const addOrUpdateAgent = require('./utils/add_new_agent');
const authenticateUser = require("./utils/authenticate_user");
const cookieParser = require("cookie-parser");
const fetchAllAssociatedAgents = require('./utils/fetch_all_associated_agents');
const deleteAgent = require("./utils/delete_agent");




const app = express();
require('dotenv').config();
app.use(cookieParser()); 

const PORT = process.env.AGENT_CREATION_PORT || 3002 ;
const secret = process.env.AGENT_ID_CREATION_SECRET || "your-secret-for-creating-agent-id";

app.use(express.static(__dirname+"/Agent_Details_Creation_UI"));

// Middleware to parse JSON
app.use(express.json());

// Simple route
app.get("/create_new_agent", (req, res) => {
  res.sendFile(__dirname+"/Agent_Details_Creation_UI/company_agent_detail.html");
});

// Get Your Agents 
app.post('/get_agents',authenticateUser, async (req, res)=>{
   const username = req.body.username;
   
  // find the agents associated with the user
    const yourAgents = await fetchAllAssociatedAgents(username);
    
    res.send(yourAgents);

})


// Create a new ai agent using fresh details
app.post("/create_new_agent", authenticateUser,async (req, res)=>{
    // add new agent
    console.log("user detected");
    
    const result = await addOrUpdateAgent(req, secret);
    console.log(result);
    res.send(result);
    
})

// Modify your existing agents using their agentId 

app.post("/modify_agent_details", authenticateUser, async (req, res)=>{
  const result = await addOrUpdateAgent(req,secret);
  console.log("user came");
  
  res.send(result);
})

app.post("/delete_agent", authenticateUser, async (req, res)=>{
  // delete agent using agent id and username
  const agentId = req.query.agentId;
  console.log(agentId);
  const username = req.body.username;
  
  
  const result =  await deleteAgent(username, agentId);
  
  res.send(result);

})



// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}/create_new_agent`);
});
