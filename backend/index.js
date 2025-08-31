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
  const templatePath = path.join(__dirname, "templates", `${templateName}.html`);
  let template = fs.readFileSync(templatePath, "utf-8");

  // Ensure CSS is linked as an external file if it exists
  const cssFile = `${templateName}.css`;
  const cssPath = path.join(__dirname, "templates", cssFile);
  if (fs.existsSync(cssPath)) {
    // Remove any <style>...</style> blocks and <link rel="stylesheet" ...> for this css
    template = template.replace(/<style[\s\S]*?<\/style>/gi, "");
    template = template.replace(/<link[^>]*href=["'][^"']*\.css["'][^>]*>/gi, "");
    // Insert correct CSS link before </head>
    template = template.replace(/<\/head>/i, `<link rel="stylesheet" href="${cssFile}" />\n</head>`);
  }

  // Replace <h1> with name
  template = template.replace(/<h1[^>]*>.*?<\/h1>/i, `<h1>${data.fullName}</h1>`);

  // Replace <p> with aboutMe (first <p> only)
  template = template.replace(/<p[^>]*>.*?<\/p>/i, `<p>${data.aboutMe}</p>`);

  // Insert or replace <img> for profile picture
  if (profilePicFilename) {
    const imgTag = `<img src="./${profilePicFilename}" alt="Profile Picture" width="200"/>`;
    if (/<img[^>]*src=["'][^"']*["'][^>]*>/i.test(template)) {
      template = template.replace(/<img[^>]*src=["'][^"']*["'][^>]*>/i, imgTag);
    } else {
      template = template.replace(/(<h1[^>]*>.*?<\/h1>)/i, `$1\n${imgTag}`);
    }
  }

  // Always inject skills list (even if empty)
  const skillsHtml = `<ul class="skills">` + (Array.isArray(data.skills) ? data.skills.map(skill => `<li>${skill}</li>`).join("") : "") + `</ul>`;
  if (/<ul[^>]*class=["']skills["'][^>]*>[\s\S]*?<\/ul>/i.test(template)) {
    template = template.replace(/<ul[^>]*class=["']skills["'][^>]*>[\s\S]*?<\/ul>/i, skillsHtml);
  } else {
    template = template.replace(/(<h1[^>]*>.*?<\/h1>)/i, `$1\n${skillsHtml}`);
  }

  // Always inject projects (even if empty)
  const projectsHtml = `<div class="projects-section">` +
    (Array.isArray(data.projects) ? data.projects.map(project =>
      `<div class="project">
        <h3>${project.name || ""}</h3>
        <p>${project.description || ""}</p>
        <p><b>Tech Stack:</b> ${project.techStack || ""}</p>
        <p><a href="${project.github || "#"}" target="_blank">${project.github ? "GitHub" : ""}</a></p>
      </div>`
    ).join("") : "") + `</div>`;
  if (/<div[^>]*class=["']projects-section["'][^>]*>[\s\S]*?<\/div>/i.test(template)) {
    template = template.replace(/<div[^>]*class=["']projects-section["'][^>]*>[\s\S]*?<\/div>/i, projectsHtml);
  } else if (/<ul[^>]*class=["']skills["'][^>]*>[\s\S]*?<\/ul>/i.test(template)) {
    template = template.replace(/(<ul[^>]*class=["']skills["'][^>]*>[\s\S]*?<\/ul>)/i, `$1\n${projectsHtml}`);
  } else {
    template = template.replace(/(<h1[^>]*>.*?<\/h1>)/i, `$1\n${projectsHtml}`);
  }

  return template;
}

app.post("/form", upload.single("profilePicture"), (req, res) => {
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

  const templateName = req.body.template || "classic";
  const htmlContent = generateHtml(data, profilePicFilename, templateName);

  const cssFileName = `${templateName}.css`;
  const cssFilePath = path.join(__dirname, "templates", cssFileName);
  const cssExists = fs.existsSync(cssFilePath);

  const archive = archiver("zip");
  res.setHeader("Content-Disposition", `attachment; filename=portfolio.zip`);
  res.setHeader("Content-Type", "application/zip");

  archive.append(htmlContent, { name: "portfolio.html" });
  if (profilePicFilename) {
    archive.file(path.join(__dirname, "uploads", profilePicFilename), { name: profilePicFilename });
  }
  if (cssExists) {
    archive.file(cssFilePath, { name: cssFileName });
  }
  archive.finalize();
  archive.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});