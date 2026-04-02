const express = require("express");
const app = express();

app.use(express.json());

app.get("/data", (req, res) => {
    res.send("API Working");
});

app.listen(5001, () => {
    console.log("Server running on port 5001");
});