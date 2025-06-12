//index.js

const express = require('express');
const cors = require('cors');
// const db = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
const api = process.env.REACT_APP_API_URL;
fetch(`${api}/api/properties`)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error fetching properties:', error));



app.use(cors());
app.use(express.json());
app.use('/api/properties', routes);
app.use('/uploads', express.static('uploads'));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


