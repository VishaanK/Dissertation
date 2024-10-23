"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
app.get("/healthcheck", (req, res) => {
    res.send(200);
});
