// Add Express
const express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
const { default: axios } = require("axios");

// Initialize Express
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const httpServer = http.createServer(app);

process.waitingOrders = [];

// Create GET request
app.get("/api/ping", (req, res) => {
  res.send("PONG");
});

app.post("/api/shipping", async (req, res) => {
  const { orderId, nbProducts } = req.body;

  if (!Number.isInteger(nbProducts)) {
    throw new Error("nbProducts is not a number");
  }

  process.waitingOrders.push({ orderId, nbProducts });

  if (process.waitingOrders.length >= 5) {
    for (const order of process.waitingOrders) {
      await axios.patch(
        "https://micro-order-ecv.vercel.app/api/order/orderId",
        {
          orderId: order.orderId,
          status: "Delivered",
        }
      );
    }

    process.waitingOrders = [];
    res.status(200).send("Livrez moi car 5 articles");
  } else {
    res.sendStatus(204);
  }
});

app.get("/api/shipping/waiting", (req, res) => {
  res.status(200).send(process.waitingOrders);
});

// Initialize server
httpServer.listen(8000, () => {
  console.log("Running on port 8000.");
});

module.exports = app;
