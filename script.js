document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const chatArea = document.getElementById("chatArea");
  const messageInput = document.getElementById("messageInput");
  const sendBtn = document.getElementById("sendBtn");
  const emojiBtn = document.getElementById("emojiBtn");
  const attachBtn = document.getElementById("attachBtn");
  const fileInput = document.getElementById("fileInput");
  const emojiPanel = document.getElementById("emojiPanel");
  let currentFriend = null;

  // Emojis
  const emojis = ["😀","😁","😂","🤣","😃","😄","😅","😉","😊","😋","😎","😍","😘","🥰"];
  emojis.forEach(e => {
    const span = document.createElement("span");
    span.textContent = e;
    span.onclick = () => { if(!messageInput.disabled) messageInput.value += e; };
    emojiPanel.appendChild(span);
  });

  // Sidebar toggle
  function toggleSidebar() {
    sidebar.classList.toggle("show");
    overlay.classList.toggle("active");
  }
  function hideSidebar() {
    sidebar.classList.remove("show");
    overlay.classList.remove("active");
  }
  window.toggleSidebar = toggleSidebar;
  window.hideSidebar = hideSidebar;

  // Fix Chrome mobile transform
  setTimeout(() => {
    sidebar.style.transform = sidebar.classList.contains("show") ? "translateX(0)" : "translateX(-100%)";
  }, 50);

  // Add friend
  window.openAddFriendModal = function() {
    const name = prompt("Enter friend's name:");
    if(!name) return;
    const li = document.createElement("li");
    li.innerHTML = `<span>${name}</span>`;
    li.onclick = () => selectFriend(name);
    document.getElementById("friendList").appendChild(li);
  }

  // Select friend
  function selectFriend(name) {
    currentFriend = name;
    document.getElementById("chatWith").innerText = "Chat with " + name;
    chatArea.innerHTML = "";
    enableChat(true);
    hideSidebar();
    scrollChatToBottom();
  }

  // Enable/disable chat
  function enableChat(enable) {
    messageInput.disabled = !enable;
    sendBtn.disabled = !enable;
    emojiBtn.disabled = !enable;
    attachBtn.disabled = !enable;
    messageInput.style.display = "inline-block";
    sendBtn.style.display = "inline-block";
    emojiBtn.style.display = "inline-block";
    attachBtn.style.display = "inline-block";
  }

  // Send message
  window.sendMessage = function() {
    if(!currentFriend) return;
    const text = messageInput.value.trim();
    if(!text) return;
    addMessage(text, "sent", null);
    messageInput.value = "";
    scrollChatToBottom();
    setTimeout(() => {
      addMessage("Reply to: " + text, "received", null);
      scrollChatToBottom();
    }, 1000);
  }

  // Add message
  function addMessage(text, type, file=null) {
    const msg = document.createElement("div");
    msg.className = "message " + type;
    if(file){
      const img = document.createElement("img");
      img.src = file;
      img.className = "previewImg";
      img.onclick = () => previewInChat(file);
      msg.appendChild(img);
      if(text){
        const label = document.createElement("div");
        label.textContent = text;
        label.style.fontSize = "12px";
        label.style.marginTop = "3px";
        msg.appendChild(label);
      }
    } else {
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

  // Preview file
  window.previewFile = function(input){
    const file = input.files[0];
    if(!file || !currentFriend) return;
    const reader = new FileReader();
    reader.onload = e => { addMessage("", "sent", e.target.result); };
    reader.readAsDataURL(file);
  }

  // Preview image overlay
  function previewInChat(src){
    const overlayDiv = document.createElement("div");
    overlayDiv.className = "chatOverlay";
    const img = document.createElement("img");
    img.src = src;
    overlayDiv.appendChild(img);
    overlayDiv.onclick = () => overlayDiv.remove();
    document.body.appendChild(overlayDiv);
  }

  // Emoji toggle
  window.toggleEmojiPanel = function() {
    emojiPanel.classList.toggle("active");
  }
  document.addEventListener("click", (e) => {
    if(!emojiPanel.contains(e.target) && !emojiBtn.contains(e.target)) {
      emojiPanel.classList.remove("active");
    }
  });

  // Scroll chat
  function scrollChatToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
  }
  window.addEventListener("resize", scrollChatToBottom);

  // Disable chat initially
  enableChat(false);
});
