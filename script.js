document.addEventListener("DOMContentLoaded", () => {
  // ----- Elements -----
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuBtn = document.querySelector(".menu-btn");
  const addBtn = document.getElementById("addFriendBtn");
  const friendList = document.getElementById("friendList");
  const chatArea = document.getElementById("chatArea");
  const chatWith = document.getElementById("chatWith");

  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const emojiBtn = document.getElementById("emojiBtn");
  const attachBtn = document.getElementById("attachBtn");
  const fileInput = document.getElementById("fileInput");
  const emojiPanel = document.getElementById("emojiPanel");

  let currentFriend = null;

  // ----- Sidebar -----
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("show");
    overlay.classList.toggle("active");
    fixChromeMobile();
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("active");
    fixChromeMobile();
  });

  // ----- Mobile Chrome fix -----
  function fixChromeMobile() {
    const chat = document.querySelector(".chat");
    chat.style.display = "none";
    chat.offsetHeight; // force reflow
    chat.style.display = "flex";
  }

  // ----- Add Friend -----
  addBtn.addEventListener("click", () => {
    const name = prompt("Enter friend's name:");
    if (!name) return;

    const li = document.createElement("li");
    li.textContent = name;
    li.addEventListener("click", () => selectFriend(name));
    friendList.appendChild(li);
  });

  // ----- Select Friend -----
  function selectFriend(name) {
    currentFriend = name;
    chatWith.textContent = "Chat with " + name;
    chatArea.innerHTML = "";
    enableChat(true);
    sidebar.classList.remove("show");
    overlay.classList.remove("active");
    scrollChatToBottom();
  }

  // ----- Enable/Disable Chat -----
  function enableChat(enable) {
    [messageInput, sendBtn, emojiBtn, attachBtn].forEach(el => el.disabled = !enable);
  }

  enableChat(false);

  // ----- Send Message -----
  sendBtn.addEventListener("click", () => {
    if (!currentFriend) return;
    const text = messageInput.value.trim();
    if (!text) return;
    addMessage(text, "sent");
    messageInput.value = "";

    setTimeout(() => {
      addMessage("Reply to: " + text, "received");
    }, 1000);
  });

  // ----- Add Message -----
  function addMessage(text, type, file=null) {
    const msg = document.createElement("div");
    msg.className = "message " + type;

    if (file) {
      const img = document.createElement("img");
      img.src = file;
      img.className = "previewImg";
      img.addEventListener("click", () => previewInChat(file));
      msg.appendChild(img);
    }

    if (text) {
      const txt = document.createElement("div");
      txt.textContent = text;
      msg.appendChild(txt);
    }

    const timestamp = document.createElement("div");
    const now = new Date();
    timestamp.className = "timestamp";
    timestamp.textContent = now.toLocaleDateString() + " " + now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    msg.appendChild(timestamp);

    chatArea.appendChild(msg);
    scrollChatToBottom();
  }

  // ----- File Attach -----
  attachBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file || !currentFriend) return;
    const reader = new FileReader();
    reader.onload = e => addMessage("", "sent", e.target.result);
    reader.readAsDataURL(file);
  });

  function previewInChat(src) {
    const overlayDiv = document.createElement("div");
    overlayDiv.className = "chatOverlay";
    const img = document.createElement("img");
    img.src = src;
    overlayDiv.appendChild(img);
    overlayDiv.addEventListener("click", () => overlayDiv.remove());
    document.body.appendChild(overlayDiv);
  }

  // ----- Emoji Panel -----
  const emojis = ["😀","😁","😂","🤣","😃","😄","😅","😉","😊","😋","😎","😍","😘","🥰"];
  emojis.forEach(e => {
    const span = document.createElement("span");
    span.textContent = e;
    span.addEventListener("click", () => {
      if (!messageInput.disabled) messageInput.value += e;
    });
    emojiPanel.appendChild(span);
  });

  emojiBtn.addEventListener("click", () => emojiPanel.classList.toggle("active"));
  document.addEventListener("click", (e) => {
    if (!emojiPanel.contains(e.target) && !emojiBtn.contains(e.target)) {
      emojiPanel.classList.remove("active");
    }
  });

  // ----- Scroll Chat -----
  function scrollChatToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
  }
  window.addEventListener("resize", scrollChatToBottom);
});
