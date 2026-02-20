import { Resend } from "resend";

export const config = {
  runtime: "edge",
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { name, email, message, type, turnstileToken } = await req.json();

    // 1. Validate Turnstile Token
    const turnstileVerify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      },
    );

    const turnstileOutcome = await turnstileVerify.json();

    if (!turnstileOutcome.success) {
      return new Response(JSON.stringify({ error: "Invalid CAPTCHA token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 2. Send Email via Resend
    const { data, error } = await resend.emails.send({
      from: "CodeLaundromat <contact@codelaundromat.com>",
      to: ["contact@codelaundromat.com"],
      subject: `New ${type || "Lead"} from CodeLaundromat`,
      html: `
        <h1>New Submission via CodeLaundromat</h1>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Handler Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
