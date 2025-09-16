let currentFriend=null;
let messagesData=[];
let contactsList=[];

// Sidebar toggle
function toggleSidebar(show=null){
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  if(show===true){ 
    sidebar.classList.add("active"); 
    overlay.classList.add("active"); 
  }
  else if(show===false){ 
    sidebar.classList.remove("active"); 
    overlay.classList.remove("active"); 
  }
  else { 
    sidebar.classList.toggle("active"); 
    overlay.classList.toggle("active"); 
  }
}

// Add friend
function requestMobileContacts(){
  const contacts=["Alice","Bob","Charlie","David"];
  const selected=prompt(`Select contact: ${contacts.join(", ")}`);
  if(selected && contacts.includes(selected)) addFriend(selected);
  else alert("No valid contact selected");
}

function addFriend(name){
  if(!name || contactsList.includes(name)) return;
  contactsList.push(name);

  const contactsUl=document.getElementById("contacts");
  const li=document.createElement("li");
  const img=document.createElement("img");
  img.src=`https://via.placeholder.com/40/${Math.floor(Math.random()*999999)}`;
  img.onclick=()=>openProfile(name,img.src);
  li.appendChild(img);

  const span=document.createElement("span");
  span.textContent=name;
  li.appendChild(span);

  li.onclick=()=>{ openChat(name,img.src); toggleSidebar(false); };
  contactsUl.appendChild(li);
}

// Open chat
function openChat(friend,url){
  currentFriend=friend;
  const header=document.getElementById("chat-header");
  header.innerHTML=`<button class="menu-btn" onclick="toggleSidebar()">☰</button><span>${friend}</span>`;
  document.getElementById("chat-box").innerHTML="";
  messagesData=[];
}

// Send message
function sendMessage(){
  const input=document.getElementById("message");
  if(!currentFriend){ alert("Select a friend first!"); return; }
  if(input.value.trim()){
    addMessage("You",input.value,"user","⏳");
    setTimeout(()=>updateLastMessageStatus("✓"),1000);
    setTimeout(()=>addMessage(currentFriend,`Reply: "${input.value}"`,"bot"),1500);
    input.value="";
  }
}

function addMessage(sender,text,type,status=""){
  const chatBox=document.getElementById("chat-box");
  const msg=document.createElement("div");
  msg.classList.add("message",type);
  msg.innerHTML=text;

  const timestamp=document.createElement("div");
  timestamp.className="timestamp";
  timestamp.textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
  msg.appendChild(timestamp);

  if(status){
    const span=document.createElement("span");
    span.className="status";
    span.textContent=status;
    msg.appendChild(span);
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop=chatBox.scrollHeight;
  messagesData.push(msg);
}

function updateLastMessageStatus(status){
  for(let i=messagesData.length-1;i>=0;i--){
    if(messagesData[i].classList.contains("user")){
      const span=messagesData[i].querySelector(".status");
      if(span) span.textContent=status;
      break;
    }
  }
}

// Profile modal
function openProfile(name,url){
  const modal=document.getElementById("profile-modal");
  modal.style.display="flex";
  document.getElementById("profile-name").textContent=name;
  document.getElementById("profile-pic-large").src=url;
}
function closeProfile(){ document.getElementById("profile-modal").style.display="none"; }

// Emoji panel
const emojiCategories={
  Smileys:["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","🥰"],
  Animals:["🐶","🐱","🐭","🐹","🐰","🦊"],
  Food:["🍏","🍎","🍐","🍊","🍋","🍌","🍉"]
};
let currentEmojiCategory="Smileys";

function toggleEmojiPanel(){
  const panel=document.getElementById("emoji-panel");
  panel.style.display=panel.style.display==="flex"?"none":"flex";
  if(panel.style.display==="flex") generateEmojis();
}

function generateEmojis(){
  const tabs=document.getElementById("emoji-tabs");
  const grid=document.getElementById("emoji-grid");
  tabs.innerHTML=""; grid.innerHTML="";

  Object.keys(emojiCategories).forEach(cat=>{
    const btn=document.createElement("button");
    btn.textContent=cat;
    btn.className="tab-btn "+(cat===currentEmojiCategory?"active":"");
    btn.onclick=()=>{ currentEmojiCategory=cat; generateEmojis(); };
    tabs.appendChild(btn);
  });

  emojiCategories[currentEmojiCategory].forEach(e=>{
    const span=document.createElement("span");
    span.textContent=e;
    span.onclick=()=>{ document.getElementById("message").value+=e; };
    grid.appendChild(span);
  });
}

// File/Image
function handleFile(){ alert("File/Image upload ready for mobile integration."); }
