require("dotenv/config");
const express = require("express");
const cors = require("cors");
const path = require("path");
var fs = require('fs');
var http = require('http');
var https = require('https');


const routes = require('./api/routes.js');

const app = express();

var privateKey  = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
app.use(cors({ origin: process.env.URL }));

app.use(express.static(path.join(__dirname, "public")));

app.use('/api', routes);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://heartofny.net'); // or '*'
  next();
});

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api/")) {
    res.redirect("/");
  } else {
    res.status(404).json();
  }
});

// app.listen(process.env.SERVER_PORT, () => {
//   console.log(`Server is running on ${process.env.SERVER_ADDRESS}:${process.env.SERVER_PORT}`)
// });


var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
