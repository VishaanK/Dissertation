import { Response } from "express";

var express = require("express");



var app = express();app.listen(3000, () => {

 console.log("Server running on port 3000");
});

app.get("/url", (req:Request, res:Response, next:any) => {
  res.send(200);
});


