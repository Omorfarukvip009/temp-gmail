const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const headers = {
  Accept: "application/json, text/plain, */*",
  Origin: "https://tempmailhub.org",
  Referer: "https://tempmailhub.org/",
  "X-Requested-With": "mark.via.gp",
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 Chrome/148.0.7778.121 Mobile Safari/537.36"
};

// Generate email
app.post("/generate", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.tempmailhub.org/emails",
      {},
      { headers }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fetch inbox (first email only)
app.post("/messages", async (req, res) => {
  try {
    const { email_id } = req.body;

    if (!email_id) {
      return res.status(400).json({
        success: false,
        error: "email_id required"
      });
    }

    const response = await axios.post(
      `https://api.tempmailhub.org/emails/messages?email_id=${email_id}`,
      {},
      { headers }
    );

    const emails = response.data.emails || [];

    if (!emails.length) {
      return res.json({ success: true, message: "No emails found" });
    }

    const mail = emails[0];

    res.json({
      success: true,
      subject: mail.subject,
      senderName: mail.senderName,
      senderEmail: mail.senderEmail,
      formattedDate: mail.formattedDate,
      body: mail.body
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
