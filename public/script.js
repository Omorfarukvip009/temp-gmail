const email = document.getElementById("email");
const emailId = document.getElementById("emailId");
const result = document.getElementById("result");

let auto = false;
let interval;

function copy(id){
  navigator.clipboard.writeText(document.getElementById(id).value);
  alert("Copied!");
}

// Generate
document.getElementById("generateBtn").onclick = async () => {
  const res = await fetch("/generate", { method:"POST" });
  const data = await res.json();

  email.value = data.email;
  emailId.value = data.email_id;

  result.innerHTML = `<div class="mail">Email Generated</div>`;
};

// Fetch
document.getElementById("fetchBtn").onclick = async () => {
  const res = await fetch("/messages", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ email_id: emailId.value })
  });

  const data = await res.json();

  result.innerHTML = `
    <div class="mail">
      <h3>${data.subject}</h3>
      <p>${data.senderEmail}</p>
      <div>${data.body}</div>
    </div>
  `;
};

// Auto refresh
document.getElementById("autoBtn").onclick = () => {
  auto = !auto;

  if(auto){
    interval = setInterval(() => {
      if(emailId.value) document.getElementById("fetchBtn").click();
    }, 5000);
  } else {
    clearInterval(interval);
  }
};

// Typing credit animation
const text = "Developed by MD OMOR FARUK";
let i = 0;

function type(){
  if(i < text.length){
    document.getElementById("typing").innerHTML += text.charAt(i);
    i++;
    setTimeout(type, 100);
  }
}

window.onload = type;
