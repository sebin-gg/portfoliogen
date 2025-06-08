import React, { useState } from "react";
import "../styles/InputPage.css";
import { useNavigate } from "react-router-dom";

const InputPage = () => {
  // State for skills list and skill input
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");

  // State for projects (max 3)
  const [projects, setProjects] = useState([{ name: "", description: "", techStack: "", github: "" }]);

  const navigate = useNavigate();

  // Add skill if not empty and not duplicate
  const handleSkillAdd = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  // Remove skill by index
  const handleSkillRemove = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Update project field value
  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index][field] = value;
    setProjects(updatedProjects);
  };

  // Add new empty project if less than 3
  const addProject = () => {
    if (projects.length < 3) {
      setProjects([...projects, { name: "", description: "", techStack: "", github: "" }]);
    }
  };

  // Handle form submit: collect data and POST to backend
  const handleSubmit = (event) => {
    event.preventDefault();

    // Collect form data from DOM (not managed by state)
    const form = event.target;

    // Create form data object
    const formData = {
      fullName: form.fullName.value,
      aboutMe: form.aboutMe.value,
      email: form.email.value,
      phone: form.phone.value,
      skills,
      projects,
      socialLinks: {
        linkedin: form.linkedin.value,
        github: form.github.value,
        instagram: form.instagram.value,
      },
      theme: form.theme.value,
    };

    // POST data as JSON
    fetch("http://localhost:5173/form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "portfolio.json";
        a.click();
        navigate("/result");
      })
      .catch((err) => console.error(err));
  };

  return (
    <form className="input-page" onSubmit={handleSubmit}>
      <div className="input-content">
        <h1>Let's build your portfolio</h1>

        {/* Full Name */}
        <div className="form-group">
          <label>Full Name*</label>
          <input type="text" name="fullName" required />
        </div>

        {/* About Me */}
        <div className="form-group">
          <label>About Me*</label>
          <textarea name="aboutMe" rows="4" placeholder="Write something about yourself..." required />
          <button type="button">✨ Suggest with AI</button>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email ID*</label>
          <input type="email" name="email" required />
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" />
        </div>

        {/* Profile Picture */}
        <div className="form-group">
          <label>Profile Picture</label>
          <input type="file" accept="image/*" />
        </div>

        {/* Skills */}
        <div className="form-group">
          <label>Skills</label>
          <div className="skills-input">
            <input
              type="text"
              placeholder="Type a skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
            />
            <button type="button" onClick={handleSkillAdd}>➕</button>
          </div>
          <div className="skills-list">
            {skills.map((skill, idx) => (
              <div key={idx}>
                {skill} <button type="button" onClick={() => handleSkillRemove(idx)}>x</button>
              </div>
            ))}
          </div>
          <button type="button">✨ Suggest Skills with AI</button>
        </div>

        {/* Projects */}
        <div className="form-group">
          <label>Projects (max 3)</label>
          {projects.map((project, index) => (
            <div className="project-input" key={index}>
              <input
                type="text"
                placeholder="Project Name*"
                required
                value={project.name}
                onChange={(e) => handleProjectChange(index, "name", e.target.value)}
              />
              <textarea
                placeholder="Description*"
                required
                value={project.description}
                onChange={(e) => handleProjectChange(index, "description", e.target.value)}
              />
              <input
                type="text"
                placeholder="Tech Stack*"
                required
                value={project.techStack}
                onChange={(e) => handleProjectChange(index, "techStack", e.target.value)}
              />
              <input
                type="url"
                placeholder="GitHub Repo Link*"
                required
                value={project.github}
                onChange={(e) => handleProjectChange(index, "github", e.target.value)}
              />
            </div>
          ))}
          {projects.length < 3 && (
            <button type="button" onClick={addProject}>Add Another Project</button>
          )}
        </div>

        {/* Social Links */}
        <div className="form-group">
          <label>Social Links</label>
          <input type="url" name="linkedin" placeholder="LinkedIn" />
          <input type="url" name="github" placeholder="GitHub" />
          <input type="url" name="instagram" placeholder="Instagram" />
        </div>

        {/* Theme */}
        <div className="form-group">
          <label>Select a Theme*</label>
          <select name="theme" required>
            <option value="">--Choose a Theme--</option>
            <option value="pastel">Pastel Play</option>
            <option value="minimal">Modern Minimal</option>
            <option value="vibrant">Vibrant Vibes</option>
            <option value="classic">Classic Portfolio</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button className="generate-btn" type="submit">
            Generate Portfolio🚀
          </button>
        </div>
      </div>
    </form>
  );
};

export default InputPage;
