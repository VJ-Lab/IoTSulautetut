const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const cors = require("cors");
const sql = require("mssql");

const config = {
  user: process.env.user,
  password: process.env.password,
  server: process.env.host,
  database: process.env.database,
  options: {
    encrypt: true,
    enableArithAbort: true,
  },
};

sql.connect(config, (err) => {
  if (err) {
    console.error("Error connecting to the SQL server:", err);
    return;
  }
  console.log("Connected to the SQL server.");
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Morjes!");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/litrat", (req, res) => {
  const request = new sql.Request();
  request.query("SELECT * FROM Litra", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(result.recordset);
  });
});

app.post("/post_litrat", (req, res) => {
  const { Litra } = req.body;
  const request = new sql.Request();
  request.input("LitraValue", sql.Float, Litra);
  request.query(
    "INSERT INTO Litra (Litra) VALUES (@LitraValue)",
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }
      res.json({ ID: result.insertId, Litra });
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
