const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const mysql = require("mysql2");

app.use(cors());
app.use(express.json());

app.listen(3001, console.log("サーバーが起動しました"));

app.use(express.static(path.join(__dirname, "public")));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quiz'
})

db.connect(error => {
  if (error) {
    console.log("SQL接続時にエラーが発生しました", error);
    return;
  }
  console.log("SQLに接続しました");
})

app.get("/api/history", (req, res) => {
  const query = `
    SELECT
    	quiz_list.id,
    	quiz_list.create_at,
    	quiz_list.category,
    	select_list.is_correct,
    	quiz_list.question
    FROM
    	quiz_list
    	JOIN select_list
    	ON quiz_list.question_id = select_list.question_id;
  `;

  db.query(query, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    res.send(result);
  })
});

app.delete("/api/history", (req, res) => {
  const delete_quiz = "TRUNCATE TABLE quiz_list;";
  const delete_select = "TRUNCATE TABLE select_list;";

  db.query(delete_quiz, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    db.query(delete_select, (error, result) => {
      if (error) {
        console.log(error);
        return;
      }
      res.send(result);
    })
  })
});

app.post("/api/quiz", (req, res) => {
  const category = req.body.category;
  const question_id = req.body.question_id;
  const question = req.body.question;
  const selects = req.body.selects;
  const answer = req.body.answer;
  const query = "INSERT INTO quiz_list (category, question_id, question, selects, answer) VALUES (?, ?, ?, ?, ?);";

  db.query(query, [category, question_id, question, selects, answer], (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    res.send(result);
  })
});

app.post("/api/select", (req, res) => {
  const question_id = req.body.question_id;
  const is_correct = req.body.is_correct;
  const select_value = req.body.select_value;
  const query = "INSERT INTO select_list (question_id, is_correct, select_value) VALUES (?, ?, ?);";

  db.query(query, [question_id, is_correct, select_value], (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
    res.send(result);
  })
});