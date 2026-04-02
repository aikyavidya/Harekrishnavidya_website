import { NextResponse } from "next/server";

// Simple POST handler for career form submissions
export async function POST(request: Request) {
  try {
    const data = await request.json();

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
    } = data || {};

    // Basic server-side validation to mirror front-end checks
    if (
      !name ||
      !email ||
      !phone ||
      !position ||
      !gender ||
      !qualification ||
      !experience ||
      !city ||
      !heardFrom ||
      !message
    ) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided." },
        { status: 400 }
      );
    }

    // TODO: Save to database, send email, or integrate with your CRM here.
    // For now we just log it on the server.
    console.log("New career application:", data);

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


