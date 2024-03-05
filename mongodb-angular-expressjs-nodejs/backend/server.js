import express from "express";
import client from "./db/mongodb.js";
const app = express();
import cors from "cors";

app.use(cors("http://localhost:4200"));

app.get("/", function (req, res) {
  res.status(200).json({ message: "Hello World" });
});

app.listen(5000, function () {
  console.log("Web application is listening on port 5000");
});
