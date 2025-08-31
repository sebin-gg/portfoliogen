import React, { useState } from "react";
import { API_URL } from "../api";
import "../styles/InputPage.css";
import { useNavigate } from "react-router-dom";

const InputPage = () => {
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [projects, setProjects] = useState([{ name: "", description: "", techStack: "", github: "" }]);
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const navigate = useNavigate();

  const handleSkillAdd = () => {
    if (skillInput.trim()) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleSkillRemove = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index][field] = value;
    setProjects(newProjects);
  };

  const addProject = () => {
    setProjects([...projects, { name: "", description: "", techStack: "", github: "" }]);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("aboutMe", aboutMe);
    formData.append("skills", JSON.stringify(skills));
    formData.append("projects", JSON.stringify(projects));
    if (profilePic) {
      formData.append("profilePicture", profilePic);
    }

    try {
      const response = await fetch(`${API_URL}/form`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert("Failed to generate portfolio.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "portfolio.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      navigate("/result");
    } catch (error) {
      alert("Error generating portfolio.");
    }
  };

  return (
    <div className="input-page">
      <div className="input-content">
        <h1>Portfolio Generator</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>About Me</label>
            <textarea value={aboutMe} onChange={e => setAboutMe(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Skills</label>
            <div className="skills-input">
              <input value={skillInput} onChange={e => setSkillInput(e.target.value)} />
              <button type="button" onClick={handleSkillAdd}>Add</button>
            </div>
            <div className="skills-list">
              {skills.map((skill, idx) => (
                <span key={idx}>
                  {skill} <button type="button" onClick={() => handleSkillRemove(idx)}>x</button>
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Projects</label>
            {projects.map((project, idx) => (
              <div className="project-input" key={idx}>
                <input placeholder="Name" value={project.name} onChange={e => handleProjectChange(idx, "name", e.target.value)} />
                <input placeholder="Description" value={project.description} onChange={e => handleProjectChange(idx, "description", e.target.value)} />
                <input placeholder="Tech Stack" value={project.techStack} onChange={e => handleProjectChange(idx, "techStack", e.target.value)} />
                <input placeholder="GitHub Link" value={project.github} onChange={e => handleProjectChange(idx, "github", e.target.value)} />
                {projects.length > 1 && <button type="button" onClick={() => removeProject(idx)}>Remove</button>}
              </div>
            ))}
            <button type="button" onClick={addProject}>Add Project</button>
          </div>
          <div className="form-group">
            <label>Profile Picture</label>
            <input type="file" accept="image/*" onChange={e => setProfilePic(e.target.files[0])} />
          </div>
          <button className="generate-btn" type="submit">Generate Portfolio</button>
        </form>
      </div>
    </div>
  );
};

export default InputPage;