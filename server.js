const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

const USERS_FILE = "users.json";

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // HTML読み込みOKにする

// 🔹ユーザー情報取得
app.get("/user/:id", (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE));
  const id = req.params.id;
  if (users[id]) {
    res.json({ id, password: users[id].password });
  } else {
    res.status(404).json({ error: "ユーザーが見つかりません" });
  }
});

// 🔹ユーザー情報更新
app.post("/updateUser", (req, res) => {
  const { id, newId, newPassword } = req.body;
  let users = JSON.parse(fs.readFileSync(USERS_FILE));

  if (!users[id]) {
    return res.status(404).json({ error: "ユーザーが存在しません" });
  }

  // ユーザー名変更 or パスワード更新
  const updatedUser = { password: newPassword || users[id].password };
  delete users[id];
  users[newId || id] = updatedUser;

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true, message: "ユーザー情報を更新しました！" });
});

// 🔹サーバー起動
app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
