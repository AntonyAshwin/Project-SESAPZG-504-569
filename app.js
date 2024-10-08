const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongorun = require('./mongodb/connection')

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.get('/mongo', (req, res) => {
  mongorun();
  res.send('mongodb connected again - working');
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
