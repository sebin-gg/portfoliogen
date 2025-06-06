const express = require('express');
const cors =require('cors');
const app = express();
const fs = require('fs');


app.use(cors());

app.use(express.json());


app.post('/submit', (req, res) => {
  const data = req.body;
  const { name } = data;

  const filePath = `userData/${name}.json`;
  fs.mkdirSync(filePath,{recursive : true});
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  console.log('Received JSON:', data);
  res.status(200).send('OK');
});
app.listen(5000, () => console.log("Server running on port 5000"));