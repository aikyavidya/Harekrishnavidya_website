import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// Define schema for career form validation
const careerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  position: z.string().min(1, "Position is required"),
  gender: z.string().min(1, "Gender is required"),
  qualification: z.string().min(1, "Qualification is required"),
  experience: z.string().min(1, "Experience is required"),
  city: z.string().min(1, "City is required"),
  heardFrom: z.string().min(1, "Source is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  website: z.string().optional(),
});

// Simple in-memory store for rate limiting (reset on server restart)
const ipCache = new Map<string, number>();
const RATE_LIMIT_MS = 60000; // 1 minute cooldown

// Simple POST handler for career form submissions
export async function POST(request: Request) {
  try {
    // 1. Get Client IP for Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "anonymous";
    const lastRequest = ipCache.get(ip);
    const now = Date.now();

    if (lastRequest && now - lastRequest < RATE_LIMIT_MS) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const data: Record<string, any> = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (data.website) {
      console.warn("Spam detected from IP:", ip);
      return NextResponse.json({ success: true, message: "Application received." });
    }

    // 3. Zod Validation
    const validation = careerSchema.safeParse(data);

    if (!validation.success) {
      const errorMessages = validation.error.issues.map(err => err.message).join(", ");
      return NextResponse.json(
        { success: false, error: `Validation failed: ${errorMessages}` },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      phone,
      position,
      gender,
      qualification,
      experience,
      city,
      heardFrom,
      message,
    } = validation.data;

    // Update the rate limit timestamp after successful validation
    ipCache.set(ip, now);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,

      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,

      },

    });

    try {
      await transporter.verify();
      console.log("✅ SMTP verified!");
    } catch (verifyError) {
      console.error("❌ SMTP verify failed:", verifyError);
      return NextResponse.json({ success: false, error: "SMTP connection failed" }, { status: 500 });
    }
    const attachments = [];
    const cvFile = data.cv as File | undefined;

    if (cvFile && typeof cvFile !== "string") {
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      attachments.push({
        filename: cvFile.name,
        content: buffer,
        contentType: cvFile.type,
      });
    }

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Career Portal" <harekrishna@gmail.com>',
      to: process.env.ADMIN_EMAIL, // The admin email address
      subject: `New Career Application from ${name} for ${position}`,
      attachments: attachments,
      text: `
        New Career Application Received:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Position Applied For: ${position}
        Gender: ${gender}
        Qualification: ${qualification}
        Experience: ${experience} years
        City: ${city}
        Heard From: ${heardFrom}
        
        Message:
        ${message}
      `,
      html: `
        <h2>New Career Application Received</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
          <tr><td style="padding: 8px;"><strong>Name</strong></td><td style="padding: 8px;">${name}</td></tr>
          <tr><td style="padding: 8px;"><strong>Email</strong></td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px;"><strong>Phone</strong></td><td style="padding: 8px;">${phone}</td></tr>
          <tr><td style="padding: 8px;"><strong>Position</strong></td><td style="padding: 8px;">${position}</td></tr>
          <tr><td style="padding: 8px;"><strong>Gender</strong></td><td style="padding: 8px;">${gender}</td></tr>
          <tr><td style="padding: 8px;"><strong>Qualification</strong></td><td style="padding: 8px;">${qualification}</td></tr>
          <tr><td style="padding: 8px;"><strong>Experience</strong></td><td style="padding: 8px;">${experience} years</td></tr>
          <tr><td style="padding: 8px;"><strong>City</strong></td><td style="padding: 8px;">${city}</td></tr>
          <tr><td style="padding: 8px;"><strong>Heard From</strong></td><td style="padding: 8px;">${heardFrom}</td></tr>
        </table>
        <br />
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    console.log("New career application processed and email sent:", email);

    return NextResponse.json(
      {
        success: true,
        message: "Application received successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error handling career application:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

