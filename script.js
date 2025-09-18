async function loadPosts() {
  const res = await fetch("/api/posts");
  const posts = await res.json();

  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  posts.forEach(post => {
    const div = document.createElement("div");
    div.className = "post";

    div.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.content}</p>
      <small>by ${post.username} on ${new Date(post.createdAt).toLocaleString()}</small>
      <div class="comments">
        ${post.comments.map(c => `<div class="comment"><b>${c.username}</b>: ${c.text}</div>`).join("")}
      </div>
      <input placeholder="Your name" id="cname-${post.id}">
      <input placeholder="Comment..." id="ctext-${post.id}">
      <button onclick="addComment(${post.id})">Reply</button>
    `;

    postsDiv.appendChild(div);
  });
}

async function createPost() {
  const username = document.getElementById("username").value || "Anonymous";
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;

  await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, title, content })
  });

  loadPosts();
}

async function addComment(postId) {
  const username = document.getElementById(`cname-${postId}`).value || "Anon";
  const text = document.getElementById(`ctext-${postId}`).value;

  await fetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, text })
  });

  loadPosts();
}

loadPosts();
