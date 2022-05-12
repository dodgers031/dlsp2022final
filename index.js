const express = require("express");
const app = express();
const dblib = require("./dblib.js");
const path = require("path");
const multer = require("multer");
const upload = multer();
const { Pool } = require("pg");
const { json } = require("express");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});


// Application folders
app.use(express.static("public"));
// Start listener
app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});
// Setup routes
app.get("/", (req, res) => {
    //res.send("Root resource - Up and running!")
    res.render("index");
});

// App Get Method template
// app.get("/manage", (req, res) => {
//     res.render("manage");
// });
sql = "SELECT * FROM product";
pool.query(sql, [], (err, res) => {
    console.log(err, res)
});