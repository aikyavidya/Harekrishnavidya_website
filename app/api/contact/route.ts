import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional().default(""),
  terms: z.boolean().optional(),
  website: z.string().optional(), // Honeypot
});

const ipCache = new Map<string, number>();
const RATE_LIMIT_MS = 30000; // 30 seconds cooldown

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const lastRequest = ipCache.get(ip);
    const now = Date.now();

    if (lastRequest && now - lastRequest < RATE_LIMIT_MS) {
      return NextResponse.json(
        { success: false, message: "Too many requests. Please try again in a few moments." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));

    // Honeypot check
    if (body.website) {
      console.warn("Spam detected from IP:", ip);
      return NextResponse.json({ success: true, message: "Message received." });
    }

    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      const errorMessages = validation.error.issues.map((err) => err.message).join(", ");
      return NextResponse.json(
        { success: false, message: `Validation failed: ${errorMessages}` },
        { status: 400 }
      );
    }

    const { name, email, phone, message } = validation.data;
    ipCache.set(ip, now);

    let emailSent = false;

    // 1. Try sending via SMTP if configured
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"Hare Krishna Vidya Contact" <${process.env.SMTP_USER}>`,
          to: process.env.ADMIN_EMAIL || "aikyavidya@hkmhyderabad.org",
          replyTo: email,
          subject: `New Contact Form Inquiry from ${name}`,
          text: `
New Contact Form Submission:

Name: ${name}
Email: ${email}
Phone: ${phone}
Message:
${message || "No message provided"}
          `,
          html: `
            <h2>New Contact Form Inquiry</h2>
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; font-family: Arial, sans-serif;">
              <tr><td><strong>Name</strong></td><td>${name}</td></tr>
              <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td><strong>Phone</strong></td><td><a href="tel:${phone}">${phone}</a></td></tr>
            </table>
            <br />
            <h3>Message:</h3>
            <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 12px; border-left: 4px solid #f97316;">${message || "No message provided"}</p>
          `,
        });
        emailSent = true;
        console.log("Contact form email sent successfully for:", email);
      } catch (smtpError) {
        console.error("SMTP delivery failed in Next.js contact route:", smtpError);
      }
    }

    // 2. Also attempt forwarding to remote backend API (non-blocking)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.harekrishnavidya.org";
      await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          data: { name, email, phone, message }
        }),
      }).catch((fetchErr) => {
        console.warn("External contact API sync warning:", fetchErr?.message);
      });
    } catch (e) {
      console.warn("Could not sync to remote contact backend:", e);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for reaching out! Your message has been received.",
        emailSent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in contact API handler:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again later or reach out directly." },
      { status: 500 }
    );
  }
}
