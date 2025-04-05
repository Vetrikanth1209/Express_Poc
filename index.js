require("dotenv").config();
const express = require("express");
const mongoose = require("./config/db");
const bodyParser = require("body-parser");
const cors = require("cors");

const poc = require("./controllers/pocController");
const expert = require("./controllers/expertController");
const consul = require("./middleware/consul");

const app = express();
const PORT = process.env.PORT ;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Called Services

app.use("/poc", poc);
app.use("/expert", expert);
app.get("/", (req, res) => res.send("Server is awake!"));

// Keep-Alive Logic
const KEEP_ALIVE_URL = "https://express-poc-ix4b.onrender.com";
const CONSUL_URL = "https://consul-hn1i.onrender.com";

const sendKeepAlive = async (url, name) => {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    console.log(`✅ Keep-alive request to ${name} sent. Status: ${response.status}`);
  } catch (err) {
    console.error(`❌ Keep-alive request to ${name} failed: ${err.message}`);
  }
};

// Ping both services
setTimeout(() => {
  sendKeepAlive(KEEP_ALIVE_URL, "Express app"); // Initial call for Express
  sendKeepAlive(CONSUL_URL, "Consul"); // Initial call for Consul
  setInterval(() => {
    sendKeepAlive(KEEP_ALIVE_URL, "Express app");
    sendKeepAlive(CONSUL_URL, "Consul");
  }, 30000); // Every 5 minutes
}, 10000);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
