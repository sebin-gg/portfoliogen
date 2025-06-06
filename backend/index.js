const express = require('express');
const cors =require('cors');
const app = express();

app.use(cors())
app.use(express.json());

app.post('/submit', (req, res) => {
  console.log('Received data:', req.body);
  res.status(200).send('Data received!');
});
app.listen(5000, () => console.log("Server running on port 5000"));