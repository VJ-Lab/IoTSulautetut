const http = require("http");
const sql = require("mssql");
require("dotenv").config();

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
  const request = new sql.Request();
  request.query("SELECT * FROM Litra", (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }
    console.log("Query result:", result.recordset);
  });
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});
const PORT = 3080;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
