const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const upload = multer();

app.use('/public', express.static(path.join(__dirname, 'public')));

app.post('/form', upload.none(), (req, res) => {
  res.console.log(req.body);
  const { theme,profilePicture,...data } = req.body; 
  console.log(data);
  if (!data) {return res.status(400).send("Data is missing.")};
  if (!theme) {return res.status(400).send("Theme is missing.")};
  const templatePath = path.join(__dirname, 'templates', `${theme}.html`);
  const outputDir = path.join(__dirname, 'public');
  if (!fs.existsSync(outputDir)) {fs.mkdirSync(outputDir);};
  const outputFileName = `${theme}_${Date.now()}.html`;
  const outputPath = path.join(outputDir, outputFileName);

  fs.readFile(templatePath, 'utf-8', (err, html) => {
    if (err) return res.status(500).send('Template not found',err);

    const filledHtml = html
    .replace('__DATA__', JSON.stringify(data).replace(/</g, '\\u003c'))
    .replace('__IMG__', profilePicture);

    fs.writeFile(outputPath, filledHtml, (err) => {
      if (err) return res.status(500).send('Failed to write HTML file.');
      

      const filePath = path.join(__dirname, 'public', outputFileName);
      res.download(filePath); // Force download
    });
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));
