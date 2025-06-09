const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors());

app.use(express.json());

app.post('/form', (req, res) => {
  const data = req.body;               // Get JSON data from request body
  const { name } = data;               // Extract 'name' from data for filename
  // Define directory path to save user data
  const dir = path.join(__dirname, 'userData');
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  // Define full file path for JSON file
  const filePath = path.join(dir, `${name}.json`);
  // Write JSON data to file with pretty formatting
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  res.download(filePath, (err) => {
    if (err) {
      console.error('Download error:', err);
      // Send error response if download fails
      res.status(500).send('Error downloading file');
    }
  });
  // Log received JSON data to console
  console.log('Received JSON:', data);
});

app.listen(5173, () => console.log("Server running on port 5173"));