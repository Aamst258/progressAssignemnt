const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

// Handle file upload
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: `http://localhost:5000/${req.file.filename}` });
});

// Serve uploaded files
app.use(express.static("uploads"));

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
