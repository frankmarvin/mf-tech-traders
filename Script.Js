// === Theme ===
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
}

// === Modal ===
function openModal(){ document.getElementById("authModal").style.display="flex"; }
function closeModal(){ document.getElementById("authModal").style.display="none"; }

// === Auth ===
let currentUser = null;
function signup(){
  const u=document.getElementById("username").value;
  const p=document.getElementById("password").value;
  if(!u||!p){ alert("Enter username & password"); return;}
  let users=JSON.parse(localStorage.getItem("users")||"{}");
  if(users[u]){ alert("User already exists"); return;}
  users[u]={password:p,balance:1000,trades:[],history:[],verified:false};
  localStorage.setItem("users",JSON.stringify(users));
  alert("Signup successful! Please login.");
}
function login(){
  const u=document.getElementById("username").value;
  const p=document.getElementById("password").value;
  let users=JSON.parse(localStorage.getItem("users")||"{}");
  if(users[u]&&users[u].password===p){
    currentUser=u;
    localStorage.setItem("currentUser",u);
    loadDashboard();
    closeModal();
  } else alert("Invalid credentials");
}
function logout(){ currentUser=null; localStorage.removeItem("currentUser"); document.getElementById("dashboard").style.display="none"; }

// === Dashboard ===
function loadDashboard(){
  let users=JSON.parse(localStorage.getItem("users")||"{}");
  if(!currentUser) currentUser=localStorage.getItem("currentUser");
  if(!currentUser||!users[currentUser]) return;
  document.getElementById("dashboard").style.display="block";
  document.getElementById("welcomeUser").innerText="Welcome, "+currentUser;
  document.getElementById("userBalance").innerText=users[currentUser].balance.toFixed(2);
  document.getElementById("accountStatus").innerText = users[currentUser].verified ? "Verified ✅" : "Unverified ❌";
  renderTrades();
  renderHistory();
}

function saveTrade(){
  let note=document.getElementById("tradeInput").value;
  if(!note) return;
  let users=JSON.parse(localStorage.getItem("users")||"{}");
  users[currentUser].trades.push(note);
  localStorage.setItem("users",JSON.stringify(users));
  document.getElementById("tradeInput").value="";
  renderTrades();
}
function renderTrades(){
  let users=JSON.parse(localStorage.getItem("users")||"{}");
  let list=document.getElementById("tradeList"); list.innerHTML="";
  users[currentUser].trades.forEach(t=>{
    let li=document.createElement("li"); li.textContent=t; list.appendChild(li);
  });
}

function simulateTrade(){
  let type=document.getElementById("tradeType").value;
  let amt=parseFloat(document.getElementById("tradeAmount").value);
  if(isNaN(amt)||amt<=0){ alert("Enter amount"); return;}
  let result=(Math.random()>0.5?1:-1)*amt*(Math.random()*0.2);
  let users=JSON.parse(localStorage.getItem("users")||"{}");
  users[currentUser].balance+=result;
  users[currentUser].history.push({type,amt,result:result.toFixed(2)});
  localStorage.setItem("users",JSON.stringify(users));
  document.getElementById("tradeResult").innerText=`${type} $${amt} => ${result>=0?"Profit":"Loss"}: ${result.toFixed(2)}`;
  loadDashboard();
}
function renderHistory(){
  let users=JSON.parse(localStorage.getItem("users")||"{}");
  let tbody=document.getElementById("transactionHistory"); tbody.innerHTML="";
  users[currentUser].history.forEach(h=>{
    let row=document.createElement("tr");
    row.innerHTML=`<td>${h.type}</td><td>${h.amt}</td><td>${h.result}</td>`;
    tbody.appendChild(row);
  });
}
function resetAccount(){
  let users=JSON.parse(localStorage.getItem("users")||"{}");
  users[currentUser]={password:users[currentUser].password,balance:1000,trades:[],history:[],verified:false};
  localStorage.setItem("users",JSON.stringify(users));
  loadDashboard();
  alert("Account reset!");
}

// === Withdraw ===
function withdraw(){
  let amount=parseFloat(document.getElementById("withdrawAmount").value);
  let users=JSON.parse(localStorage.getItem("users")||"{}");
  if(!amount||amount<=0){document.getElementById("withdrawMessage").innerText="Enter valid amount"; return;}
  if(amount<250){document.getElementById("withdrawMessage").innerText="Minimum withdrawal is KSH 250"; return;}
  if(!users[currentUser].verified){document.getElementById("withdrawMessage").innerText="Account not verified!"; return;}
  if(amount>users[currentUser].balance){document.getElementById("withdrawMessage").innerText="Insufficient funds"; return;}
  users[currentUser].balance-=amount;
  localStorage.setItem("users",JSON.stringify(users));
  document.getElementById("withdrawMessage").innerText="Withdrawal of KSH "+amount+" successful!";
  loadDashboard();
}

// === Ticker ===
function updateTicker(){
  const data=["BTC $65000","ETH $3200","AAPL $150","TSLA $750","EUR/USD 1.08","Gold $1900"];
  document.getElementById("tickerContent").textContent=data.join(" | ");
}
updateTicker();

if(localStorage.getItem("currentUser")){ currentUser=localStorage.getItem("currentUser"); loadDashboard(); }
