const express = require("express");
const app = express();
const port = process.env.PORT || 3080;

const cors = require("cors");
const sql = require("mssql");

//TIETOKANNAN KONFIGUROINTI
const config = {
  user: process.env.user,
  password: process.env.password,
  server: process.env.host,
  database: process.env.database,
};

//SQL YHTEYS
sql.connect(config, (err) => {
  if (err) {
    console.error("Error connecting to the SQL server:", err);
    return;
  }
  console.log("Connected to the SQL server. ");
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("IoT Sensori / kohoanturi");
});

//CORS MÄÄRITTELY, * => PÄÄSEE KAIKKIALTA KIINNI
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow_origin", "*");
  next();
});

app.get("/get_", (req, res) => {
  const request = new sql.Request();
  request.query("SELECT * FROM Bucket", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }
    res.json(result.recordset);
  });
});

app.post("/post_Litre", (req, res) => {
  const { litre, timestamp } = req.body;
  const request = new sql.Request();
  request.input("LitreValue", sql.Float, litre);
  request.input("TimeStampValue", sql.DateTime, timestamp);
  request.query(
    "INSERT INTO Bucket (Litre, TimeStamp) VALUES (@litreValue, @TimeStampValue)",
    (err, result) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).send("Server error");
        return;
      }
      res.json({ id: result.insertId, litre, timestamp });
    }
  );
});

app.listen(port, () => {
  console.log("Server is running on http://localhost:${port}");
});
