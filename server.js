const express = require("express");
const addOrUpdateAgent = require('./utils/add_new_agent');
const authenticateUser = require("./utils/authenticate_user");
const cookieParser = require("cookie-parser");
const fetchAllAssociatedAgents = require('./utils/fetch_all_associated_agents');
const deleteAgent = require("./utils/delete_agent");
const getModificationHistory = require("./utils/performance_metrics_utility/get_modification_history");
const getAgentRecord = require("./utils/performance_metrics_utility/get_agent_record");
const getAgentCustomerReviews = require("./utils/performance_metrics_utility/get_agent_customer_reviews");
const getAgentUsageStats = require("./utils/performance_metrics_utility/get_agent_usage_stats");
const getAgentRequestsHandled = require("./utils/performance_metrics_utility/get_agent_requests_handled");
const createPerformanceMetrics = require("./utils/performance_metrics_utility/create_performance_metrics");
const getAgentSatisfactionStats = require("./utils/performance_metrics_utility/get_agent_satisfaction");




const app = express();
require('dotenv').config();
app.use(cookieParser()); 

const PORT = process.env.AGENT_CREATION_PORT || 3002 ;
const secret = process.env.AGENT_ID_CREATION_SECRET || "your-secret-for-creating-agent-id";


// Setting static folder structure for sending static files in the ui 


app.use(express.static(__dirname+ "/Performance_Metrics"));
app.use(express.static(__dirname+"/Agent_Details_Creation_UI"));
app.use("/css_metrics", express.static(__dirname + "/Performance_Metrics/css_metrics"));
app.use("/utils_metrics", express.static(__dirname + "/Performance_Metrics/utils_metrics"));




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
  const username = req.body.username;
  
  
  const result =  await deleteAgent(username, agentId);
  
  res.send(result);

})


// Sending the performance metrics page Performance_Metrics/performance_metrics.html

app.get("/performance_metrics", (req, res) =>{
  
  // Send the html file for the performance metrics
  res.sendFile(__dirname+"/Performance_Metrics/performance_metrics.html");
} )

// handle data sending for the performance metrics page

app.post("/performance_metrics/:metricType", authenticateUser, async (req, res) => {
  try {
    const { username, agentId } = req.body;
    const { metricType } = req.params || undefined;
    const { timestamp } = req.query; // 👈 timestamp for reviews
    const { timeframe } = req.query; 

    let result;

    switch (metricType) {
      case "modification_history":
        if (!agentId) {
          return res.status(400).json({ error: "agentId is required for modification_history" });
        }
        result = await getModificationHistory(username, agentId);
        break;

      case "agent_record":
        result = await getAgentRecord(username);
        break;

      case "customer_reviews":
        if (!agentId) {
          return res.status(400).json({ error: "agentId is required for customer_reviews" });
        }
        // if no timestamp given, use current time (fetch latest 10)
        const startTime = timestamp || new Date().toISOString();
        result = await getAgentCustomerReviews(username, agentId, startTime);
        break;

      case "usage_stats":
        if (!agentId) {
          return res.status(400).json({ error: "agentId is required for usage_stats" });
        }
        result = await getAgentUsageStats(username, agentId, timeframe);
        break;

      case "requests_handled":
        if (!agentId) {
          return res.status(400).json({ error: "agentId is required for requests_handled" });
        }
        result = await getAgentRequestsHandled(username, agentId, timeframe);
        break;

      case "satisfaction_rate_logs":
        if (!agentId) {
          return res.status(400).json({ error: "agentId is required for satisfaction_rate_logs" });
        }
        result = await getAgentSatisfactionStats(username, agentId, timeframe);
        break;

      case "all": // when user hits just /performance_metrics
        result = await createPerformanceMetrics(username);
        break;

      default:
        return res.status(400).json({ error: `Unknown metric type: ${metricType}` });
    }

    res.json(result);

  } catch (err) {
    console.error("Error in /performance_metrics route:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}/create_new_agent`);
});
