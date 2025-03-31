const express = require("express");
const fs = require("fs");
const app = express();

const SERVER_ID = process.env.SERVER_ID || "Unknown";

app.get("/info", (req, res) => {
  res.json({ server: SERVER_ID });
});

app.get("/count", (req, res) => {
  const text = fs.readFileSync("./text.txt", "utf8");
  res.json({ server: SERVER_ID, length: text.length });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ${SERVER_ID} running on port ${PORT}`);
});
