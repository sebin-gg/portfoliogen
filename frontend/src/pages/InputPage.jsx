import React, { useState } from "react";
import "../styles/InputPage.css";
import { useNavigate } from "react-router-dom";

const InputPage = () => {
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([{ name: "", description: "", techStack: "", github: "" }]);

  const handleSkillAdd = () => {
    // logic to add skill
  };

  const handleSkillRemove = (index) => {
    // logic to remove skill
  };

  const handleProjectChange = (index, field, value) => {
    // logic to update project fields
  };

  const addProject = () => {
    if (projects.length < 3) {
      setProjects([...projects, { name: "", description: "", techStack: "", github: "" }]);
    }
  };

  const navigate = useNavigate();

const handleGenerateClick = () => {
  // optionally do validation or data saving here
  navigate("/result");
};

  return (
    <div className="input-page">
      <div className="input-content">
      <h1>Let's build your portfolio</h1>

      {/* Full Name */}
      <div className="form-group">
        <label>Full Name*</label>
        <input type="text" required />
      </div>

      {/* About Me with AI Suggestion */}
      <div className="form-group">
        <label>About Me*</label>
        <textarea rows="4" placeholder="Write something about yourself..." required />
        <button type="button">✨ Suggest with AI</button>
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email ID*</label>
        <input type="email" required />
      </div>

      {/* Phone (Optional) */}
      <div className="form-group">
        <label>Phone Number</label>
        <input type="tel" />
      </div>

      {/* Profile Picture Upload */}
      <div className="form-group">
        <label>Profile Picture</label>
        <input type="file" accept="image/*" />
      </div>

      {/* Skills */}
      <div className="form-group">
        <label>Skills</label>
        <div className="skills-input">
          <input type="text" placeholder="Type a skill..." />
          <button type="button">➕</button>
        </div>
        <div className="skills-list">
          {/* List of skills with remove buttons */}
        </div>
        <button type="button">✨ Suggest Skills with AI</button>
      </div>

      {/* Projects */}
      <div className="form-group">
        <label>Projects (max 3)</label>
        {projects.map((project, index) => (
          <div className="project-input" key={index}>
            <input type="text" placeholder="Project Name*" required />
            <textarea placeholder="Description*" required />
            <input type="text" placeholder="Tech Stack*" required />
            <input type="url" placeholder="GitHub Repo Link*" required />
          </div>
        ))}
        {projects.length < 3 && (
          <button type="button" onClick={addProject}>Add Another Project</button>
        )}
      </div>

      {/* Social Links */}
      <div className="form-group">
        <label>Social Links</label>
        <input type="url" placeholder="LinkedIn" />
        <input type="url" placeholder="GitHub" />
        <input type="url" placeholder="Instagram" />
      </div>

      {/* Theme Selection */}
      <div className="form-group">
        <label>Select a Theme*</label>
        <select required>
          <option value="">--Choose a Theme--</option>
          <option value="pastel">Pastel Play</option>
          <option value="minimal">Modern Minimal</option>
          <option value="vibrant">Vibrant Vibes</option>
          <option value="classic">Classic Portfolio</option>
        </select>
      </div>

      {/* Generate Button */}
      <div className="form-group">
        <button className="generate-btn" onClick={handleGenerateClick}>
  Generate Portfolio🚀
</button>
      </div>
    </div>
    </div>
  );
};

export default InputPage;
