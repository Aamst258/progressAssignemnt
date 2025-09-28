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
    // acl: "public-read",  <-- REMOVE this line
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    cb(null, allowedTypes.includes(file.mimetype));
  },
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  console.log("📄 File uploaded:", {
    bucket: req.file.bucket,
    key: req.file.key,
    size: req.file.size,
    mimetype: req.file.mimetype,
    metadata: req.file.metadata,
  });

  res.json({ url: req.file.location });
});

app.listen(5000, () =>
  console.log("✅ Server running on http://localhost:5000")
);
