const express = require("express");
const connectDB = require("./db");

const app = express();

app.use(express.json());

connectDB();

app.listen(5001, () => {
    console.log("server running");
});