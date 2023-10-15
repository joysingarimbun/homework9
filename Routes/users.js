var express = require("express");
var pool = require("../db_connect");
var router = express.Router();

router.get("/", function (req, res) {
  pool.query(`SELECT * FROM users ${req.query.limit ? "LIMIT" + req.query.limit : ""}`, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result.rows);
  });
});

router.get("/:id", async (req, res) => {
  var { id } = req.params;

  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Data not found" });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", (req, res) => {
  const { id, email, gender, password, role } = req.body;
  pool.query("INSERT INTO users (id, email, gender, password, role) VALUES ($1, $2, $3, $4, $5)", [id, email, gender, password, role], (error, result) => {
    if (error) {
      res.status(500).send({ error: "Internal Server Error" });
    } else {
      res.status(201).send(result.rows);
    }
  });
});

router.put("/:id", (req, res) => {
  const Id = req.params.id;
  const { id, email, gender, password, role } = req.body;
  const query = "UPDATE users SET id = $1, email = $2, gender = $3, password = $4, role=$5 WHERE id = $6";
  const values = [id, email, gender, password, role];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Error", err);
      return res.status(500).json({ error: "Failed to update data in the database." });
    }
    const updateMovies = result.rows[0];
    res.json(updateMovies);
  });
});

router.delete("/:id", (req, res) => {
  const Id = req.params.id;
  const query = "DELETE FROM users WHERE id = $1 ";
  const values = [Id];
  pool.query(query, values, (err, result) => {
    if (err) {
      console.error("Error", err);
      return res.status(500).json({ error: "Failed to delete data from the database." });
    }
    const deleteMovies = result.rows[0];
    res.json(deleteMovies);
  });
});
module.exports = router;
