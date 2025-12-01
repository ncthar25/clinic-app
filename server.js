const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) console.error("DB opening error:", err);
  else console.log("Database connected");
});

// Create patients table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  age INTEGER,
  disease TEXT,
  visit_date TEXT
)`);

const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post("/add", (req, res) => {
  const { name, age, disease, visit_date } = req.body;
  db.run(
    `INSERT INTO patients (name, age, disease, visit_date) VALUES (?,?,?,?)`,
    [name, age, disease, visit_date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Saved", id: this.lastID });
    }
  );
});

app.get("/export", (req, res) => {
  db.all(`SELECT * FROM patients`, [], (err, rows) => {
    if (err) return res.status(500).send(err.message);

    let csv = "id,name,age,disease,visit_date\n";
    rows.forEach((r) => {
      csv += `${r.id},${r.name},${r.age},${r.disease},${r.visit_date}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.send(csv);
  });
});

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
