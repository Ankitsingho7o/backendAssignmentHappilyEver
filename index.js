const express = require("express");

const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 4000;


// adding middleware for body parsing 
app.use(express.json());

// making server to listen(activating server)
app.listen(PORT, () => {
    console.log("server is active at port" + PORT);
})

// connecting to databse
const dbconnect = require("./config/database");
dbconnect();



// console.log(hours + " hours and " + minutes + " minutes");
// mounting routes on server
const router = require("./routes.js/router");
app.use("/api/v1", router);

app.get("/", (req, res) => {
    res.send(`<h1>This Is Default Route</h1>`);
});      