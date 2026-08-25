const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");
const { ZipArchive } = require("archiver");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Keep only a plain extension - originalname is attacker-controlled.
    const ext = path.extname(file.originalname).replace(/[^.a-zA-Z0-9]/g, "").slice(0, 10);
    const filename = `profilepic_${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

// Only allow simple names so the value can never traverse directories.
const TEMPLATE_NAME_RE = /^[A-Za-z0-9_-]{1,64}$/;
const TEMPLATES_ROOT = path.resolve(__dirname, "templates");
const UPLOADS_ROOT = path.resolve(__dirname, "uploads");

function safeJoin(root, relativeName) {
  const candidate = path.resolve(root, relativeName);
  if (candidate !== root && !candidate.startsWith(root + path.sep)) {
    return null;
  }
  return candidate;
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function caseInsensitiveIndexOf(haystack, needle, fromIndex) {
  return haystack.toLowerCase().indexOf(needle.toLowerCase(), fromIndex);
}

function removeStyleBlocks(template) {
  let result = template;
  let start = caseInsensitiveIndexOf(result, "<style", 0);
  while (start !== -1) {
    const endTag = caseInsensitiveIndexOf(result, "</style>", start);
    if (endTag === -1) break;
    result = result.slice(0, start) + result.slice(endTag + "</style>".length);
    start = caseInsensitiveIndexOf(result, "<style", 0);
  }
  return result;
}

function removeCssLinkTags(template) {
  let result = template;
  let start = caseInsensitiveIndexOf(result, "<link", 0);
  while (start !== -1) {
    const end = result.indexOf(">", start);
    if (end === -1) break;
    const tag = result.slice(start, end + 1);
    if (/href\s*=\s*["'][^"']*\.css["']/i.test(tag)) {
      result = result.slice(0, start) + result.slice(end + 1);
      start = caseInsensitiveIndexOf(result, "<link", 0);
    } else {
      start = caseInsensitiveIndexOf(result, "<link", end);
    }
  }
  return result;
}

// Replace the body of the first <tag ...>...</tag> occurrence with newContent.
function replaceFirstElement(template, tagName, newContent) {
  const openStart = caseInsensitiveIndexOf(template, "<" + tagName, 0);
  if (openStart === -1) return null;
  const openEnd = template.indexOf(">", openStart);
  if (openEnd === -1) return null;
  const closeStart = caseInsensitiveIndexOf(template, "</" + tagName, openEnd);
  if (closeStart === -1) return null;
  const closeEnd = closeStart + tagName.length + 3;
  return template.slice(0, openStart) + newContent + template.slice(closeEnd);
}

// Replace the first <img ...> tag with newContent, or insert after the first <h1>.
function replaceOrInsertImg(template, newContent) {
  const imgStart = caseInsensitiveIndexOf(template, "<img", 0);
  if (imgStart !== -1) {
    const imgEnd = template.indexOf(">", imgStart);
    if (imgEnd !== -1) {
      return template.slice(0, imgStart) + newContent + template.slice(imgEnd + 1);
    }
  }
  const h1Open = caseInsensitiveIndexOf(template, "<h1", 0);
  if (h1Open === -1) return template + "\n" + newContent;
  const h1Close = caseInsensitiveIndexOf(template, "</h1>", h1Open);
  if (h1Close === -1) return template + "\n" + newContent;
  const insertAt = h1Close + "</h1>".length;
  return template.slice(0, insertAt) + "\n" + newContent + template.slice(insertAt);
}

// Replace the element that contains marker (e.g. class="skills") up to closing tag.
function replaceBlockByMarker(template, openTag, marker, closingTag, newContent) {
  const markerIdx = caseInsensitiveIndexOf(template, marker, 0);
  if (markerIdx === -1) return null;
  const openStart = template.toLowerCase().lastIndexOf("<" + openTag, markerIdx);
  if (openStart === -1) return null;
  const closeStart = caseInsensitiveIndexOf(template, "</" + closingTag, markerIdx);
  if (closeStart === -1) return null;
  const closeEnd = closeStart + closingTag.length + 3;
  return template.slice(0, openStart) + newContent + template.slice(closeEnd);
}

// Insert newContent after the first <h1>...</h1> element.
function insertAfterFirstH1(template, newContent) {
  const h1Open = caseInsensitiveIndexOf(template, "<h1", 0);
  if (h1Open === -1) return template + "\n" + newContent;
  const h1Close = caseInsensitiveIndexOf(template, "</h1>", h1Open);
  if (h1Close === -1) return template + "\n" + newContent;
  const insertAt = h1Close + "</h1>".length;
  return template.slice(0, insertAt) + "\n" + newContent + template.slice(insertAt);
}

function generateHtml(data, profilePicFilename, templateName) {
  const templatePath = safeJoin(TEMPLATES_ROOT, `${templateName}.html`);
  if (!templatePath) return null;
  let template = fs.readFileSync(templatePath, "utf-8");

  // Ensure CSS is linked as an external file if it exists
  const cssFile = `${templateName}.css`;
  const cssPath = safeJoin(TEMPLATES_ROOT, cssFile);
  if (fs.existsSync(cssPath)) {
    template = removeStyleBlocks(template);
    template = removeCssLinkTags(template);
    // Insert correct CSS link before </head>
    const headClose = caseInsensitiveIndexOf(template, "</head>", 0);
    if (headClose !== -1) {
      template =
        template.slice(0, headClose) +
        `<link rel="stylesheet" href="${esc(cssFile)}" />\n` +
        template.slice(headClose);
    }
  }

  // Replace <h1> with name
  const nameHtml = replaceFirstElement(
    template,
    "h1",
    `<h1>${esc(data.fullName || "")}</h1>`
  );
  if (nameHtml !== null) template = nameHtml;

  // Replace <p> with aboutMe (first <p> only)
  const aboutHtml = replaceFirstElement(
    template,
    "p",
    `<p>${esc(data.aboutMe || "")}</p>`
  );
  if (aboutHtml !== null) template = aboutHtml;

  // Insert or replace <img> for profile picture
  if (profilePicFilename) {
    const imgTag = `<img src="./${esc(profilePicFilename)}" alt="Profile Picture" width="200"/>`;
    template = replaceOrInsertImg(template, imgTag);
  }

  // Always inject skills list (even if empty)
  const skillsList = Array.isArray(data.skills)
    ? data.skills.map((skill) => `<li>${esc(skill)}</li>`).join("")
    : "";
  const skillsHtml = `<ul class="skills">${skillsList}</ul>`;
  const skillsReplaced = replaceBlockByMarker(
    template,
    "ul",
    'class="skills"',
    "ul",
    skillsHtml
  );
  if (skillsReplaced !== null) {
    template = skillsReplaced;
  } else {
    template = insertAfterFirstH1(template, skillsHtml);
  }

  // Always inject projects (even if empty)
  const projectsList = Array.isArray(data.projects)
    ? data.projects
        .map(
          (project) => `<div class="project">
        <h3>${esc(project.name || "")}</h3>
        <p>${esc(project.description || "")}</p>
        <p><b>Tech Stack:</b> ${esc(project.techStack || "")}</p>
        <p><a href="${esc(project.github || "#")}" target="_blank">${
            project.github ? "GitHub" : ""
          }</a></p>
      </div>`
        )
        .join("")
    : "";
  const projectsHtml = `<div class="projects-section">${projectsList}</div>`;
  const projectsReplaced = replaceBlockByMarker(
    template,
    "div",
    'class="projects-section"',
    "div",
    projectsHtml
  );
  if (projectsReplaced !== null) {
    template = projectsReplaced;
  } else {
    const skillsMarker = caseInsensitiveIndexOf(template, 'class="skills"', 0);
    if (skillsMarker !== -1) {
      const afterSkills = replaceBlockByMarker(
        template,
        "ul",
        'class="skills"',
        "ul",
        skillsHtml + "\n" + projectsHtml
      );
      template = afterSkills !== null ? afterSkills : insertAfterFirstH1(template, projectsHtml);
    } else {
      template = insertAfterFirstH1(template, projectsHtml);
    }
  }

  return template;
}

app.post("/form", formLimiter, upload.single("profilePicture"), (req, res) => {
  let parsedSkills = [];
  let parsedProjects = [];
  try {
    parsedSkills = JSON.parse(req.body.skills || "[]");
    parsedProjects = JSON.parse(req.body.projects || "[]");
  } catch (err) {
    return res.status(400).json({ error: "Invalid skills or projects payload" });
  }

  const data = {
    ...req.body,
    skills: parsedSkills,
    projects: parsedProjects,
  };
  let profilePicFilename = "";
  if (req.file) {
    profilePicFilename = req.file.filename;
  }

  const templateName = req.body.template || "classic";
  if (!TEMPLATE_NAME_RE.test(templateName)) {
    return res.status(400).json({ error: "Invalid template name" });
  }
  const htmlContent = generateHtml(data, profilePicFilename, templateName);
  if (htmlContent === null) {
    return res.status(400).json({ error: "Invalid template name" });
  }

  const cssFileName = `${templateName}.css`;
  const cssFilePath = safeJoin(TEMPLATES_ROOT, cssFileName);
  const cssExists = cssFilePath !== null && fs.existsSync(cssFilePath);

  const archive = new ZipArchive();
  res.setHeader("Content-Disposition", `attachment; filename=portfolio.zip`);
  res.setHeader("Content-Type", "application/zip");

  archive.append(htmlContent, { name: "portfolio.html" });
  if (profilePicFilename) {
    const uploadPath = safeJoin(UPLOADS_ROOT, profilePicFilename);
    if (uploadPath) {
      archive.file(uploadPath, { name: profilePicFilename });
    }
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
