const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `profilepic_${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

function generateHtml(data, profilePicFilename, templateName) {
  // Load the template HTML file
  const templatePath = path.join(__dirname, "templates", `${templateName}.html`);
  let template = fs.readFileSync(templatePath, "utf-8");

  // Replace <h1> with name
  template = template.replace(/<h1[^>]*>.*?<\/h1>/i, `<h1>${data.fullName}</h1>`);

  // Replace <p> with aboutMe (first <p> only)
  template = template.replace(/<p[^>]*>.*?<\/p>/i, `<p>${data.aboutMe}</p>`);

  // Insert or replace <img> for profile picture
  if (profilePicFilename) {
    const imgTag = `<img src="./${profilePicFilename}" alt="Profile Picture" width="200"/>`;
    if (/<img[^>]*src=["'][^"']*["'][^>]*>/i.test(template)) {
      // Replace first <img> tag
      template = template.replace(/<img[^>]*src=["'][^"']*["'][^>]*>/i, imgTag);
    } else {
      // Insert after <h1>
  template = template.replace(/(<h1[^>]*>.*?<\/h1>)/i, `$1\n${imgTag}`);
    }
  }

  // Optionally, inject skills, projects, etc. (add more replacements as needed)
  return template;
}

app.post("/form", upload.single("profilePicture"), (req, res) => {
  // Parse JSON fields sent as strings
  const data = {
    ...req.body,
    skills: JSON.parse(req.body.skills || "[]"),
    projects: JSON.parse(req.body.projects || "[]"),
    socialLinks: JSON.parse(req.body.socialLinks || "{}"),
  };
  let profilePicFilename = "";
  if (req.file) {
    profilePicFilename = req.file.filename;
  }

  // Use template from frontend or fallback to 'classic'
  const templateName = req.body.template || "classic";
  const htmlContent = generateHtml(data, profilePicFilename, templateName);

  // Find and include the CSS file if it exists
  let cssFile = path.join(__dirname, "templates", `${templateName}.css`);
  let cssExists = fs.existsSync(cssFile);
  // If template links to a CSS file, add it to the zip

  const archive = archiver("zip");
  res.setHeader("Content-Disposition", `attachment; filename=portfolio.zip");
  res.setHeader("Content-Type", "application/zip");

  archive.append(htmlContent, { name: "portfolio.html" });
  if (profilePicFilename) {
    archive.file(path.join(__dirname, "uploads", profilePicFilename), { name: profilePicFilename });
  }
  if (cssExists) {
    archive.file(cssFile, { name: `${templateName}.css` });
  }
  archive.finalize();
  archive.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});