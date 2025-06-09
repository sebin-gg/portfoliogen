const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');
// Enable CORS for cross-origin requests
app.use(cors());
app.use(express.json());

app.use('/public',express.static(path.join(__dirname,'public')));
app.post('/form', (req, res) => {
  const data = req.body;        // Get JSON data from request body
  const theme = data.theme;     
  // Define directory path to save user data
const templatepath=path.join(__dirname,'templates',`${theme}.html`);
const outputDir = path.join(__dirname, 'public');
const outputFileName = `${theme}_${Date.now()}.html`;
const outputPath = path.join(outputDir,outputFileName);

  fs.readFile(templatepath, 'utf-8', (err, html) => {
    if (err) return res.status(500).send('Template not found.');

    const filledHtml = html.replace('__DATA__', JSON.stringify(data-theme));

    fs.writeFile(outputPath, filledHtml, (err) => {
      if (err) return res.status(500).send('Failed to write HTML file.');
      res.send({ link: `/public/${outputFileName}` });
    });
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));