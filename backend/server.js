const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const upload = multer(); // in-memory

app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));

app.post("/form", upload.single("profilePicture"), (req, res) => {
  try {
    const { theme, ...data } = req.body;
    const profilePictureBuffer = req.file?.buffer;

    if (!data || Object.keys(data).length === 0) return res.status(400).send("Data missing.");
    if (!theme) return res.status(400).send("Theme missing.");

    const templatePath = path.join(__dirname, "templates", `${theme}.html`);
    const outputDir = path.join(__dirname, "public");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const outputFileName = `${theme}_${Date.now()}.html`;
    const outputPath = path.join(outputDir, outputFileName);

    fs.readFile(templatePath, "utf-8", (err, html) => {
      if (err) return res.status(500).send("Template not found");

      const profilePictureBase64 = profilePictureBuffer
        ? `data:${req.file.mimetype};base64,${profilePictureBuffer.toString("base64")}`
        : "";

      const filledHtml = html
        .replace("__DATA__", JSON.stringify(data).replace(/</g, "\\u003c"))
        .replace("__IMG__", profilePictureBase64);

      fs.writeFile(outputPath, filledHtml, (err) => {
        if (err) return res.status(500).send("Failed to write HTML file.");
        res.download(outputPath);
      });
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

app.listen(3001, () => console.log("Server running on port 3001"));
