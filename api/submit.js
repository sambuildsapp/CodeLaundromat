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
    const { name, email, message, code_access, type, turnstileToken } =
      await req.json();

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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00d2ff; border-bottom: 2px solid #00d2ff; padding-bottom: 10px;">New ${type || "Lead"} from CodeLaundromat</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${name || "Not provided"}</p>
            <p><strong>Email:</strong> ${email || "Not provided"}</p>
          </div>

          ${
            code_access
              ? `
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Code Access</h3>
            <p>${code_access}</p>
          </div>
          `
              : ""
          }

          <div style="background: #fef7f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #334155; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${message || "No message provided"}</p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px; color: #64748b; font-size: 12px;">
            <p>This submission was sent via the CodeLaundromat website contact form.</p>
            <p>Submitted at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
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
