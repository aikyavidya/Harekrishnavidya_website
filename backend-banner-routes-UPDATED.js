// Add these routes to your existing Express server on port 5000
// Make sure you have: npm install multer cors

const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");

// Banner file path (adjust path based on your backend structure)
const BANNER_DIR = path.join(__dirname, "public", "uploads");
const BANNER_FILE = path.join(BANNER_DIR, "banner.jpg");

// Ensure uploads directory exists
async function ensureUploadsDir() {
  try {
    await fs.mkdir(BANNER_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating uploads directory:", error);
  }
}

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("File must be an image"), false);
    }
  },
});

// GET /api/banner/get - Fetch banner (matches BannerManagement component)
app.get("/api/banner/get", async (req, res) => {
  try {
    await ensureUploadsDir();

    try {
      await fs.access(BANNER_FILE);
      return res.json({
        url: "/uploads/banner.jpg",
        message: "Banner found",
      });
    } catch (error) {
      return res.json({
        url: null,
        message: "No banner found",
      });
    }
  } catch (error) {
    console.error("Error fetching banner:", error);
    return res.status(500).json({ error: "Failed to fetch banner" });
  }
});

// POST /api/banner/upload - Upload banner (matches BannerManagement component)
app.post("/api/banner/upload", upload.single("banner"), async (req, res) => {
  try {
    await ensureUploadsDir();

    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Delete existing banner if it exists
    try {
      await fs.unlink(BANNER_FILE);
    } catch (error) {
      // File doesn't exist, which is fine
    }

    // Write new banner file
    await fs.writeFile(BANNER_FILE, req.file.buffer);

    return res.json({
      url: "/uploads/banner.jpg",
      message: "Banner uploaded successfully",
    });
  } catch (error) {
    console.error("Error uploading banner:", error);
    return res.status(500).json({ error: "Failed to upload banner" });
  }
});

// DELETE /api/banner/delete - Delete banner (matches BannerManagement component)
app.delete("/api/banner/delete", async (req, res) => {
  try {
    try {
      await fs.unlink(BANNER_FILE);
      return res.json({ message: "Banner deleted successfully" });
    } catch (error) {
      return res.json({ message: "No banner found to delete" });
    }
  } catch (error) {
    console.error("Error deleting banner:", error);
    return res.status(500).json({ error: "Failed to delete banner" });
  }
});

