const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const axios = require("axios");
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
    console.error("Virhe yhdistettäessä SQL serveriin:", err);
    return;
  }
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
  request.query(
    "SELECT TOP 20 CONVERT(VARCHAR(33), CreatedAt, 126) AS CreatedAt, Litra FROM Litra ORDER BY CreatedAt DESC;",
    (err, result) => {
      if (err) {
        console.error("Virhe kyselyn suorittamisessa:", err);
        res.status(500).send("Serveri virhe");
        return;
      }
      res.json(result.recordset);
    }
  );
});
app.get("/temp", async (req, res) => {
  try {
    const picoResponse = await axios.get("http://192.168.3.29:8080/temp");
    const temperature = picoResponse.data.temperature;
    res.json({ temperature });
  } catch (error) {
    console.error("Virhe kommunikoidessa Pico W:n kanssa, ", error);
    res.status(500).send("Virhe lämpötilan haussa.");
  }
});

app.post("/post_litrat", (req, res) => {
  const { Litra } = req.body;
  const request = new sql.Request();
  request.input("LitraValue", sql.Float, Litra);
  request.query(
    "INSERT INTO Litra (Litra) VALUES (@LitraValue)",
    (err, result) => {
      if (err) {
        console.error("Virhe kyselyn suorittamisessa:", err);
        res.status(500).send("Serveri virhe");
        return;
      }
      res.json({ ID: result.insertId, Litra });
    }
  );
});

app.listen(port, () => {
  console.log(`Serveri pyörii osoitteessa: http://localhost:${port}`);
});
