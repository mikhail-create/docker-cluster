const express = require("express");
const fs = require("fs");
const promClient = require('prom-client');
const app = express();

const SERVER_ID = process.env.SERVER_ID || "Unknown";
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const PORT = process.env.PORT || 3000;

collectDefaultMetrics({ timeout: 5000 });

// Create a counter for requests
const requestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Middleware to count requests
app.use((req, res, next) => {
  res.on('finish', () => {
    requestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode
    });
  });
  next();
});


// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});

app.get("/info", (req, res) => {
  res.json({ server: SERVER_ID });
});

app.get("/count", (req, res) => {
  console.log("REQUEST HERE");

  const text = fs.readFileSync("./text.txt", "utf8");
  res.json({ server: SERVER_ID, length: text.length });
});

app.listen(PORT, () => {
  console.log(`Server ${SERVER_ID} running on port ${PORT}`);
});
