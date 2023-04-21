// Add Express
const express = require("express");
var bodyParser = require("body-parser");
const { default: axios } = require("axios");
// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let waitingProducts = [];

// Create GET request
app.get("/api/ping", (req, res) => {
  res.send("PONG");
});

app.post("/api/shipping", (req, res) => {
  const { orderId, nbProducts } = req.body;

  if (!Number.isInteger(nbProducts)) {
    throw new Error("nbProducts is not a number");
  }

  waitingProducts.push({ orderId, nbProducts });

  res.sendStatus(204);
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

app.get("/api/shipping/waiting", (req, res) => {
  res.statusCode(200).send(waitingProducts);
  waitingProducts = [];
});

if (waitingProducts.length === 5) {
  axios.get("/api/shipping/waiting");
}

module.exports = app;
