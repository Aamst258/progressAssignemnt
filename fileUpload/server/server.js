require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");

const app = express();
app.use(cors());

// 🔹 Configure AWS SDK v3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// 🔹 Setup multer with S3 storage
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    key: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
    metadata: (req, file, cb) => {
      cb(null, {
        fieldName: file.fieldname,
        originalName: file.originalname,
        uploadTime: new Date().toISOString(),
      });
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // Allow up to 10MB (adjust as needed)
});

// 🔹 File upload endpoint with error handling
app.post("/upload", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ error: "File too large. Max size is 10MB." });
      }
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Log info
    console.log("📄 File uploaded:", {
      key: req.file.key,
      size: req.file.size,
      mimetype: req.file.mimetype,
      metadata: req.file.metadata,
    });

    // Send info to frontend
    res.json({
      url: req.file.location,
      key: req.file.key,
      size: req.file.size,
      mimetype: req.file.mimetype, // <-- File type here
      metadata: req.file.metadata,
    });
  });
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
