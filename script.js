document.addEventListener("DOMContentLoaded", () => {
  const loginPage = document.getElementById("loginPage");
  const appPage = document.getElementById("appPage");
  const loginBtn = document.getElementById("loginBtn");
  const verifyOtpBtn = document.getElementById("verifyOtpBtn");
  const mobileInput = document.getElementById("mobileInput");
  const otpContainer = document.getElementById("otpContainer");
  const otpDigits = document.querySelectorAll(".otp-digit");

  // Mock OTP and mobile
  const mockOTP = "999999";
  const mockMobile = "+1 555-555-5555";

  // ---------------- LOGIN ----------------
  loginBtn.addEventListener("click", () => {
    const mobile = mobileInput.value.trim();
    if(mobile === mockMobile) {
      otpContainer.classList.remove("hidden");
      alert("OTP sent: " + mockOTP);
      otpDigits[0].focus();
    } else {
      alert("Invalid mobile number!");
    }
  });

  // ---------------- OTP auto jump ----------------
  otpDigits.forEach((input, i) => {
    input.addEventListener("input", () => {
      if(input.value.length === 1 && i < otpDigits.length - 1) otpDigits[i+1].focus();
    });
    input.addEventListener("keydown", e => {
      if(e.key === "Backspace" && input.value === "" && i > 0) otpDigits[i-1].focus();
    });
  });

  // ---------------- VERIFY OTP ----------------
  verifyOtpBtn.addEventListener("click", () => {
    const enteredOtp = Array.from(otpDigits).map(input => input.value).join("");
    if(enteredOtp === mockOTP) {
      loginPage.classList.add("hidden");
      appPage.classList.remove("hidden");
    } else {
      alert("Invalid OTP!");
    }
  });

  // ---------------- CHAT APP ----------------
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

  function escapeHtml(str){ return str.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m])); }

  menuBtn.addEventListener("click",()=>{sidebar.classList.add("show");overlay.classList.add("active");});
  overlay.addEventListener("click",()=>{sidebar.classList.remove("show");overlay.classList.remove("active");});
  addFriendBtn.addEventListener("click",()=>{const name=prompt("Enter friend's name:");if(name){const li=document.createElement("li");li.textContent=name;li.addEventListener("click",()=>openChat(name));friendList.appendChild(li);}});
  
  function openChat(name){
    chatWith.textContent="Chat with "+name;
    placeholderMessage.style.display="none";
    messageInput.disabled=false;
    sendBtn.disabled=false;
    emojiBtn.disabled=false;
    attachBtn.disabled=false;
    chatArea.innerHTML="";
    sidebar.classList.remove("show");
    overlay.classList.remove("active");
  }

  sendBtn.addEventListener("click",()=>{
    const text=messageInput.value.trim();if(!text)return;
    const msg=document.createElement("div");msg.className="message sent";
    msg.innerHTML=`<div>${escapeHtml(text)}</div><div class="timestamp">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>`;
    chatArea.appendChild(msg);chatArea.scrollTop=chatArea.scrollHeight;messageInput.value="";
    setTimeout(()=>botReply(text),1000);
  });

  function botReply(userText){
    const replies=["That's interesting! 🌸","Tell me more...","I totally get you!","Haha 😂 good one!","Nice 👍",`You said: "${escapeHtml(userText)}"`];
    const reply=replies[Math.floor(Math.random()*replies.length)];
    const botMsg=document.createElement("div");botMsg.className="message received";
    botMsg.innerHTML=`<div>${reply}</div><div class="timestamp">${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>`;
    chatArea.appendChild(botMsg);chatArea.scrollTop=chatArea.scrollHeight;
  }

  // Emoji Panel
  const emojis=["😀","😂","😍","😎","😅","😉","😊","😋","👍","🙏","🔥","🌸"];
  emojis.forEach(e=>{const span=document.createElement("span");span.textContent=e;span.addEventListener("click",()=>messageInput.value+=e);emojiPanel.appendChild(span);});
  emojiBtn.addEventListener("click",()=>emojiPanel.classList.toggle("active"));
  document.addEventListener("click",(ev)=>{if(!emojiPanel.contains(ev.target)&&ev.target!==emojiBtn)emojiPanel.classList.remove("active");});

  // File Attach
  attachBtn.addEventListener("click",()=>fileInput.click());
  fileInput.addEventListener("change",()=>{
    const file=fileInput.files[0];if(!file)return;
    const msg=document.createElement("div");msg.className="message sent";
    if(file.type.startsWith("image/")){const reader=new FileReader();reader.onload=(e)=>{msg.innerHTML=`<img src="${e.target.result}" class="previewImg"/><div class="timestamp">${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>`;chatArea.appendChild(msg);chatArea.scrollTop=chatArea.scrollHeight;};reader.readAsDataURL(file);} 
    else {msg.innerHTML=`<div>📎 ${escapeHtml(file.name)}</div><div class="timestamp">${new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>`;chatArea.appendChild(msg);chatArea.scrollTop=chatArea.scrollHeight;}
    fileInput.value="";
  });
});
