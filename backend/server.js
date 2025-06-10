const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());


app.use('/public', express.static(path.join(__dirname, 'public')));

app.post('/form', (req, res) => {
  const { theme, ...data } = req.body;
  console.log('Theme received:', theme);
  if (!theme) {return res.status(400).send("Theme is missing.")};
  const templatePath = path.join(__dirname, 'templates', `${theme}.html`);
  const outputDir = path.join(__dirname, 'public');
  if (!fs.existsSync(outputDir)) {fs.mkdirSync(outputDir);};
  const outputFileName = `${theme}_${Date.now()}.html`;
  const outputPath = path.join(outputDir, outputFileName);
  console.log('hi:',theme);
  fs.readFile(templatePath, 'utf-8', (err, html) => {
    if (err) return res.status(500).send('Template not found',err);

    const filledHtml = html.replace('__DATA__', JSON.stringify(data));

    fs.writeFile(outputPath, filledHtml, (err) => {
      if (err) return res.status(500).send('Failed to write HTML file.');

      const filePath = path.join(__dirname, 'public', outputFileName);
      res.download(filePath); // Force download
    });
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));
