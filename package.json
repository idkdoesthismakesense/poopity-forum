import express from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// DB setup
const adapter = new JSONFile("db.json");
const db = new Low(adapter, { posts: [] });
await db.read();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Get all posts
app.get("/api/posts", (req, res) => {
  res.json(db.data.posts);
});

// Add a post
app.post("/api/posts", async (req, res) => {
  const { username, title, content } = req.body;
  const newPost = {
    id: Date.now(),
    username,
    title,
    content,
    createdAt: new Date().toISOString(),
    comments: []
  };
  db.data.posts.unshift(newPost); // newest first
  await db.write();
  res.json(newPost);
});

// Add a comment
app.post("/api/posts/:id/comments", async (req, res) => {
  const post = db.data.posts.find(p => p.id == req.params.id);
  if (!post) return res.status(404).send("Post not found");

  const { username, text } = req.body;
  const newComment = {
    id: Date.now(),
    username,
    text,
    createdAt: new Date().toISOString()
  };

  post.comments.push(newComment);
  await db.write();
  res.json(newComment);
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
