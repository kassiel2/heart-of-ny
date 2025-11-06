require("dotenv/config");
const express = require("express");
const cors = require("cors");
const path = require("path");

const countiesRoute = require("./api/counties.js");
const societiesRoute = require("./api/societies.js");

const app = express();

app.use(cors({ origin: process.env.URL }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/counties", countiesRoute);
app.use("/api/societies", societiesRoute);

app.get("*", (_, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on ${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}`)
});
