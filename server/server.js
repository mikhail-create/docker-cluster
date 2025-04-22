const express = require("express");
const fs = require("fs");
const promClient = require('prom-client');
const natural = require('natural');
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
  const charToFind = req.query.char;

  if (!charToFind || charToFind.length !== 1) {
    return res.status(400).json({
      server: SERVER_ID,
      error: "Please provide a single character to search for using the 'char' query parameter"
    });
  }

  // TODO: Буферизированное чтение
  // TODO: AI Времязатратные операции
  try {
    const text = fs.readFileSync("./text.txt", "utf8");
    let count = 0;

    for (let i = 0; i < text.length; i++) {
      if (text[i] === charToFind) {
        count++;
      }
    }

    res.json({
      server: SERVER_ID,
      character: charToFind,
      count: count,
      length: text.length
    });
  } catch (error) {
    res.status(500).json({
      server: SERVER_ID,
      error: "Failed to read the file"
    });
  }
});

// NLP AI operations endpoint
app.get("/nlp", (req, res) => {
  const textFile = fs.readFileSync("./text.txt", "utf8");
  // Take only 1/10 of the text file
  const halfLength = Math.floor(textFile.length / 10);
  const halfText = textFile.substring(0, halfLength);
  const text = req.query.text || halfText;
  const startTime = Date.now();
  // Initialize NLP tools
  const tokenizer = new natural.WordTokenizer();
  const stemmer = natural.PorterStemmer;
  const sentiment = new natural.SentimentAnalyzer('English', stemmer, 'afinn');
  
  // Perform various NLP operations
  const tokens = tokenizer.tokenize(text);
  const stemmedWords = tokens.map(word => stemmer.stem(word));
  const sentimentScore = sentiment.getSentiment(tokens);
  
  // Calculate sentiment label
  let sentimentLabel = 'neutral';
  if (sentimentScore > 0.2) sentimentLabel = 'positive';
  else if (sentimentScore < -0.2) sentimentLabel = 'negative';

  res.json({
    server: SERVER_ID,
    processingTime: `${Date.now() - startTime}ms`
  });
});

app.listen(PORT, () => {
  console.log(`Server ${SERVER_ID} running on port ${PORT}`);
});
