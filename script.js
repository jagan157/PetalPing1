document.addEventListener("DOMContentLoaded", () => {

  /* ================= AUTH SYSTEM ================= */

  const loginPage = document.getElementById("loginPage");
  const appPage = document.getElementById("appPage");

  const usernameInput = document.getElementById("usernameInput");
  const passwordInput = document.getElementById("passwordInput");
  const emailInput = document.getElementById("emailInput");
  const authBtn = document.getElementById("authBtn");
  const toggleAuth = document.getElementById("toggleAuth");
  const formTitle = document.getElementById("formTitle");

  const otpContainer = document.getElementById("otpContainer");
  const otpInput = document.getElementById("otpInput");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");

  let users = JSON.parse(localStorage.getItem("users")) || {};
  let generatedOTP = "";
  let isSignup = false;

  // Toggle Sign In / Sign Up
  toggleAuth.addEventListener("click", () => {
    isSignup = !isSignup;
    formTitle.textContent = isSignup ? "Sign Up to PetalPing 🌸" : "Sign In to PetalPing 🌸";
    authBtn.textContent = isSignup ? "Sign Up" : "Sign In";
    toggleAuth.textContent = isSignup
      ? "Already have an account? Sign In"
      : "New user? Sign Up";
    emailInput.classList.toggle("hidden", !isSignup);
  });

  // Sign In / Sign Up
  authBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const email = emailInput.value.trim();

    if (!username || !password) {
      alert("Please fill all required fields");
      return;
    }

    // -------- SIGN IN --------
    if (!isSignup) {
      if (!users[username]) {
        alert("User not found. Please Sign Up.");
        return;
      }
      if (users[username].password !== password) {
        alert("Incorrect password");
        return;
      }
      loginSuccess(username);
    }

    // -------- SIGN UP --------
    else {
      if (users[username]) {
        alert("User already exists");
        return;
      }
      if (!email) {
        alert("Email is required");
        return;
      }

      generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      alert("Email OTP sent (Demo): " + generatedOTP);

      users[username] = {
        password,
        email,
        verified: false
      };

      localStorage.setItem("users", JSON.stringify(users));
      otpContainer.classList.remove("hidden");
    }
  });

  // OTP Verification
  verifyOtpBtn.addEventListener("click", () => {
    if (otpInput.value === generatedOTP) {
      users[usernameInput.value].verified = true;
      localStorage.setItem("users", JSON.stringify(users));
      loginSuccess(usernameInput.value);
    } else {
      alert("Invalid OTP");
    }
  });

  function loginSuccess(username) {
    loginPage.classList.add("hidden");
    appPage.classList.remove("hidden");
    document.getElementById("chatWith").textContent = "Welcome " + username;
  }

  /* ================= CHAT APP ================= */

  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const overlay = document.getElementById("overlay");
  const addFriendBtn = document.getElementById("addFriendBtn");
  const friendList = document.getElementById("friendList");
  const chatWith = document.getElementById("chatWith");
  const placeholderMessage = document.getElementById("placeholderMessage");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const emojiBtn = document.getElementById("emojiBtn");
  const attachBtn = document.getElementById("attachBtn");
  const chatArea = document.getElementById("chatArea");
  const emojiPanel = document.getElementById("emojiPanel");
  const fileInput = document.getElementById("fileInput");

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])
    );
  }

  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("show");
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("show");
    overlay.classList.remove("active");
  });

  addFriendBtn.addEventListener("click", () => {
    const name = prompt("Enter friend's name:");
    if (!name) return;
    const li = document.createElement("li");
    li.textContent = name;
    li.addEventListener("click", () => openChat(name));
    friendList.appendChild(li);
  });

  function openChat(name) {
    chatWith.textContent = "Chat with " + name;
    placeholderMessage.style.display = "none";
    messageInput.disabled = false;
    sendBtn.disabled = false;
    emojiBtn.disabled = false;
    attachBtn.disabled = false;
    chatArea.innerHTML = "";
    sidebar.classList.remove("show");
    overlay.classList.remove("active");
  }

  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    const msg = document.createElement("div");
    msg.className = "message sent";
    msg.innerHTML = `
      <div>${escapeHtml(text)}</div>
      <div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
    messageInput.value = "";

    setTimeout(() => botReply(text), 1000);
  }

  function botReply(userText) {
    const replies = [
      "That's interesting 🌸",
      "Tell me more...",
      "I totally get you!",
      "Haha 😂",
      "Nice 👍",
      `You said: "${escapeHtml(userText)}"`
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    const botMsg = document.createElement("div");
    botMsg.className = "message received";
    botMsg.innerHTML = `
      <div>${reply}</div>
      <div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
    chatArea.appendChild(botMsg);
    chatArea.scrollTop = chatArea.scrollHeight;
  }

  /* ================= EMOJI ================= */

  const emojis = ["😀", "😂", "😍", "😎", "😅", "😉", "😊", "😋", "👍", "🙏", "🔥", "🌸"];
  emojis.forEach(e => {
    const span = document.createElement("span");
    span.textContent = e;
    span.addEventListener("click", () => messageInput.value += e);
    emojiPanel.appendChild(span);
  });

  emojiBtn.addEventListener("click", () => emojiPanel.classList.toggle("active"));

  document.addEventListener("click", e => {
    if (!emojiPanel.contains(e.target) && e.target !== emojiBtn) {
      emojiPanel.classList.remove("active");
    }
  });

  /* ================= FILE ATTACH ================= */

  attachBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const msg = document.createElement("div");
    msg.className = "message sent";

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => {
        msg.innerHTML = `
          <img src="${e.target.result}" class="previewImg"/>
          <div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        `;
        chatArea.appendChild(msg);
        chatArea.scrollTop = chatArea.scrollHeight;
      };
      reader.readAsDataURL(file);
    } else {
      msg.innerHTML = `
        <div>📎 ${escapeHtml(file.name)}</div>
        <div class="timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      `;
      chatArea.appendChild(msg);
      chatArea.scrollTop = chatArea.scrollHeight;
    }
    fileInput.value = "";
  });

});
