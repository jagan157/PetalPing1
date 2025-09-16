const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const chatArea = document.getElementById("chatArea");
const messageInput = document.getElementById("messageInput");
const emojiPanel = document.getElementById("emojiPanel");
const fileInput = document.getElementById("fileInput");
let currentFriend = null;

// Chat input elements
const chatInputElements = {
  input: messageInput,
  emojiBtn: document.querySelector(".emoji-btn"),
  attachBtn: document.querySelector(".attach-btn"),
  sendBtn: document.getElementById("sendBtn")
};

// Disable chat initially
function disableChatInput() {
  chatInputElements.input.disabled = true;
  chatInputElements.input.placeholder = "Select a friend to start chatting...";
  chatInputElements.emojiBtn.disabled = true;
  chatInputElements.attachBtn.disabled = true;
  chatInputElements.sendBtn.disabled = true;
}
function enableChatInput() {
  chatInputElements.input.disabled = false;
  chatInputElements.input.placeholder = "Type a message...";
  chatInputElements.emojiBtn.disabled = false;
  chatInputElements.attachBtn.disabled = false;
  chatInputElements.sendBtn.disabled = false;
}

// Initialize as disabled
disableChatInput();

// Emojis
const emojis = ["😀","😁","😂","🤣","😃","😄","😅","😉","😊","😋","😎","😍","😘","🥰"];
emojis.forEach(e => {
  const span = document.createElement("span");
  span.textContent = e;
  span.onclick = () => {
    if(!currentFriend) return;
    messageInput.value += e;
    messageInput.focus();
  };
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

// Add friend
function openAddFriendModal() {
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
  hideSidebar();
  enableChatInput();
}

// Send message
function sendMessage() {
  if(!currentFriend) return;
  const text = messageInput.value.trim();
  if(!text) return;
  addMessage(text,"sent", null, currentFriend);
  messageInput.value = "";

  setTimeout(() => {
    addMessage("Reply to: "+text,"received", null, currentFriend);
  },1000);
}

// Add message
function addMessage(text, type, file=null, sender=null){
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

  if(sender){
    const senderDiv = document.createElement("div");
    senderDiv.textContent = sender;
    senderDiv.style.fontSize = "10px";
    senderDiv.style.opacity = "0.6";
    msg.insertBefore(senderDiv, msg.firstChild);
  }

  const timestamp = document.createElement("div");
  const now = new Date();
  timestamp.className = "timestamp";
  timestamp.textContent = now.toLocaleDateString() + " " + now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  msg.appendChild(timestamp);

  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// File preview
function previewFile(input){
  const file = input.files[0];
  if(!file || !currentFriend) return;
  const reader = new FileReader();
  reader.onload = e => addMessage("", "sent", e.target.result, currentFriend);
  reader.readAsDataURL(file);
}

// Image overlay
function previewInChat(src){
  const overlay = document.createElement("div");
  overlay.className = "chatOverlay";
  const img = document.createElement("img");
  img.src = src;
  overlay.appendChild(img);
  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}

// Emoji toggle
function toggleEmojiPanel(){
  if(!currentFriend) return;
  emojiPanel.style.display = (emojiPanel.style.display === "block") ? "none" : "block";
}

// Close emoji when clicking outside
document.addEventListener("click", (e)=>{
  if(!emojiPanel.contains(e.target) && !e.target.classList.contains("emoji-btn"))
    emojiPanel.style.display = "none";
});
