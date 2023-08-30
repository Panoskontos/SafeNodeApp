const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Setting up SQLite database
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE users (id INT, name TEXT)");
    const stmt = db.prepare("INSERT INTO users VALUES (?, ?)");
    stmt.run(1, 'John Doe');
    stmt.run(2, 'Jane Smith');
    stmt.finalize();
});

// 1. Vulnerability: Arbitrary JavaScript Execution via eval()
// http://localhost:3000/eval?input=while(true){console.log("hacked")}

app.get('/eval', (req, res) => {
    const input = req.query.input;
    eval(input);
    res.send('Executed your input!');
});

// 2. Vulnerability: SQL Injection
// http://localhost:3000/users?id=2
// http://localhost:3000/users?id=1%20OR%201=1

app.get('/users', (req, res) => {
    const userId = req.query.id;
    db.all(`SELECT * FROM users WHERE id = ${userId}`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.send(rows);
    });
});

// 3. Vulnerability: No rate limiting
// for i in {1..10000}; do curl http://localhost:3000/no-rate-limit & done
app.get('/no-rate-limit', (req, res) => {
    res.send('This route has no rate limiting!');
});

// 4. Vulnerability: Cross Site Scripting (XSS)
// http://localhost:3000/xss?comment=<script>alert('XSS!');</script>
app.get('/xss', (req, res) => {
    const userComment = req.query.comment;
    res.send(`User Comment: ${userComment}`);
});

app.get('/', (req, res) => {
    res.send(`Welcome to my safe app`);
});


// Start server
app.listen(port, () => {
    console.log(`Node app listening at http://localhost:${port}`);
});
