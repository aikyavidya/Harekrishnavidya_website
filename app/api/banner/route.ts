import { NextRequest, NextResponse } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Banner file path
const BANNER_DIR = path.join(process.cwd(), "public", "uploads");
const BANNER_FILE = path.join(BANNER_DIR, "banner.jpg");

// Ensure uploads directory exists
async function ensureUploadsDir() {
  if (!existsSync(BANNER_DIR)) {
    await mkdir(BANNER_DIR, { recursive: true });
  }
}

// GET - Fetch banner
export async function GET() {
  try {
    await ensureUploadsDir();

    if (!existsSync(BANNER_FILE)) {
      return NextResponse.json(
        { url: null, message: "No banner found" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { url: "/uploads/banner.jpg", message: "Banner found" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

// POST - Upload banner
export async function POST(request: NextRequest) {
  try {
    await ensureUploadsDir();

    const formData = await request.formData();
    const file = formData.get("banner") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Delete existing banner if it exists
    if (existsSync(BANNER_FILE)) {
      await unlink(BANNER_FILE);
    }

    // Write new banner file
    await writeFile(BANNER_FILE, buffer);

    return NextResponse.json(
      {
        url: "/uploads/banner.jpg",
        message: "Banner uploaded successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading banner:", error);
    return NextResponse.json(
      { error: "Failed to upload banner" },
      { status: 500 }
    );
  }
}

// DELETE - Delete banner
export async function DELETE() {
  try {
    if (!existsSync(BANNER_FILE)) {
      return NextResponse.json(
        { message: "No banner found to delete" },
        { status: 200 }
      );
    }

    await unlink(BANNER_FILE);

    return NextResponse.json(
      { message: "Banner deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}

