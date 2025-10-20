const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 3000;
const USERS_FILE = "./users.json";

// 🔹 JSONファイルを安全に読み込む関数
function loadUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, "utf8");
    return JSON.parse(data || "{}");
  } catch (err) {
    console.error("⚠️ users.json読み込みエラー:", err);
    return {};
  }
}

// 🔹 JSONファイルを安全に書き込む関数
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// ================================
// 🚀 API一覧
// ================================

// ① ユーザー情報取得
app.get("/getUser/:id", (req, res) => {
  const id = req.params.id;
  const users = loadUsers();

  if (users[id]) {
    res.json({ id, password: users[id].password });
  } else {
    res.status(404).json({ error: "ユーザーが見つかりません" });
  }
});

// ② ユーザー情報更新（名前変更対応）
app.post("/updateUser", (req, res) => {
  const { id, newId, password } = req.body;
  let users = loadUsers();

  if (!users[id]) {
    return res.status(404).json({ error: "ユーザーが存在しません" });
  }

  // 名前変更対応
  if (newId && newId !== id) {
    if (users[newId]) {
      return res.status(400).json({ error: "そのユーザー名は既に存在します！" });
    }
    users[newId] = { password };
    delete users[id];
  } else {
    users[id].password = password;
  }

  saveUsers(users);
  res.json({ success: true });
});

// ③ 新規ユーザー登録
app.post("/addUser", (req, res) => {
  const { id, password } = req.body;
  let users = loadUsers();

  if (!id || !password) {
    return res.status(400).json({ error: "ユーザー名とパスワードは必須です！" });
  }

  if (users[id]) {
    return res.status(400).json({ error: "そのユーザー名はすでに存在します！" });
  }

  users[id] = { password };
  saveUsers(users);
  res.json({ success: true, message: "ユーザーを追加しました！" });
});

// ④ ユーザー削除
app.post("/deleteUser", (req, res) => {
  const { id } = req.body;
  let users = loadUsers();

  if (!users[id]) {
    return res.status(404).json({ error: "ユーザーが見つかりません" });
  }

  delete users[id];
  saveUsers(users);
  res.json({ success: true, message: "ユーザーを削除しました！" });
});

// ================================
// ✅ サーバー起動
// ================================
app.listen(PORT, () => {
  console.log(`✅ サーバー起動中 → http://localhost:${PORT}`);
});
