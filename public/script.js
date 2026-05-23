const emailInput = document.getElementById("email");
const emailIdInput = document.getElementById("emailId");
const result = document.getElementById("result");

let autoRefresh = false;
let interval;

// Copy function
function copy(id){
  const text = document.getElementById(id).value;
  navigator.clipboard.writeText(text);
  alert("Copied!");
}

// Generate email
document.getElementById("generateBtn").onclick = async () => {

  result.innerHTML = `<div class="mail">Generating email...</div>`;

  try {
    const res = await fetch("/generate", {
      method: "POST"
    });

    const data = await res.json();

    emailInput.value = data.email;
    emailIdInput.value = data.email_id;

    result.innerHTML = `
      <div class="mail">
        <h3>✅ Email Created</h3>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Email ID:</b> ${data.email_id}</p>
      </div>
    `;

  } catch (err) {
    result.innerHTML = `<div class="mail">Error generating email</div>`;
  }
};

// Fetch ALL emails
async function fetchEmails(){

  result.innerHTML = `<div class="mail">Fetching inbox...</div>`;

  try {
    const res = await fetch("/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_id: emailIdInput.value })
    });

    const data = await res.json();

    if (!data.emails || data.emails.length === 0) {
      result.innerHTML = `<div class="mail">No emails found</div>`;
      return;
    }

    result.innerHTML = "";

    data.emails.forEach(mail => {
      result.innerHTML += `
        <div class="mail">
          <h3>${mail.subject}</h3>
          <p><b>From:</b> ${mail.senderEmail}</p>
          <p><b>Date:</b> ${mail.date}</p>
          <hr style="margin:10px 0; border-color:#334155;">
          <div>${mail.body}</div>
        </div>
      `;
    });

  } catch (err) {
    result.innerHTML = `<div class="mail">Error loading inbox</div>`;
  }
}

// Fetch button
document.getElementById("fetchBtn").onclick = fetchEmails;

// Auto refresh
document.getElementById("autoBtn").onclick = () => {

  autoRefresh = !autoRefresh;

  if (autoRefresh) {
    interval = setInterval(() => {
      if (emailIdInput.value) {
        fetchEmails();
      }
    }, 5000);

    document.getElementById("autoBtn").innerText = "🟢 Auto Refresh ON";

  } else {
    clearInterval(interval);
    document.getElementById("autoBtn").innerText = "🔄 Auto Refresh OFF";
  }
};
