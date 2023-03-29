const express = require("express");
const { PORT } = require("./config");
const cors = require("cors");
const dbConnection = require("./database");
const otproutes = require("./routes/otproutes");
const userRoutes = require("./routes/userRoutes");
const app = express();
const expressWs = require("express-ws")(app);
require("./database");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("working");
});

app.use("/api/v1", otproutes);
app.use("/api/v1", userRoutes);
expressWs.app.ws("/echo/:id", (ws, req) => {
  setInterval(() => {
    ws.send(req.params.id);
  }, 1000);

  ws.on("close", () => {
    console.log("WebSocket was closed");
  });
});

app.listen(PORT, () => {
  console.log(`${PORT} is listeniong`);
});

process.on("uncaughtException", async (err) => {
  console.log("crit", "main", `There was an uncaught error: => ${err}`);
  process.exit(1);
});

process.on("unhandledRejection", async (reason, p) => {
  console.log(
    "crit",
    "main",
    `Unhandled Rejection at: ${p}, reason:, ${reason.stack || reason}`
  );
  process.exit(1);
});
