const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const USERS_FILE = "users.json";

if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}

app.get("/", (req, res) => {
  res.send("Backend CUP online");
});

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: "Utente già esistente" });
  }

  users.push({ username, password });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ success: true });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE));

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ success: false });
  }

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server online sulla porta " + PORT);
});
