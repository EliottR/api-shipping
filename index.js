// Add Express
const express = require("express");
var bodyParser = require("body-parser");
var http = require("http");

// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const httpServer = http.createServer(app);

process.waitingProducts = [];

// Create GET request
app.get("/api/ping", (req, res) => {
  res.send("PONG");
});

app.post("/api/shipping", (req, res) => {
  const { orderId, nbProducts } = req.body;

  if (!Number.isInteger(nbProducts)) {
    throw new Error("nbProducts is not a number");
  }

  process.waitingProducts.push({ orderId, nbProducts });

  if (process.waitingProducts.length === 5) {
    process.waitingProducts = [];
    res.status(200).send("Livrez moi car 5 articles");
  } else {
    res.sendStatus(204);
  }
});

app.get("/api/shipping/waiting", (req, res) => {
  res.status(200).send(process.waitingProducts);
});

// Initialize server
httpServer.listen(8000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;
