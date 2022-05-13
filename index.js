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


//get import
app.get("/import", async (req, res) => {
    const totRecs = await dblib.getTotalRecords();
    const book = {
        book_id: "",
        title: "",
        total_pages: "",
        rating: "",
        isbn: "",
        published_date: ""
    };
    res.render("import", {
        type: "get",
        totRecs: totRecs.totRecords,
        book: book
    });
});
// post import
app.post("/import", upload.single('filename'), async (req, res) => {
    const totRecs = await dblib.getTotalRecords();
    if (!req.file || Object.keys(req.file).length === 0) {
        message = "Error: Import file not uploaded";
        return res.send(message);
    };
    //Read file line by line, inserting records
    const buffer = req.file.buffer;
    const lines = buffer.toString().split(/\r?\n/);
    const model = req.body;
    var successCount = 0;
    var failCount = 0;
    var errorList = [];
    var recCount = lines.length;

    lines.forEach(line => {
        //console.log(line);
        book = line.split(",");
        //console.log(book);
        const sql = "INSERT INTO BOOK(book_id, title, total_pages, rating, isbn, published_date ) VALUES ($1, $2, $3, $4, $5, $6)";
        pool.query(sql, book, (err, result) => {
            if (err) {
                console.log(`Insert Error.  Error message: ${err.message}`);
                failCount++;
                errorList.push("Book ID: ", model.book_id, " - ", err.message);
            } else {
                console.log(`Inserted successfully`);
                successCount++;
            }
            if(recCount == (failCount+successCount)){
                message = `Processing Complete - Processed ${recCount} records`;
                res.render("import", {
                    model: model,
                    success: successCount,
                    failed: failCount,
                    totRecs: totRecs.totRecords,
                    errors: errorList,
                    type: "POST"
                });
            }
        });
    });
});
//get sumofseries

app.get("/sumofseries", (req, res) => {
    res.render("sumofseries");
});
// post sumofseries
app.post("/sumofseries", (req, res) => {
    res.render("sumofseries");
    // console.log("The Sum of the number from 1 to 10 incremented by 2 is 25");
    
});
