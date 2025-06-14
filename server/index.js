//index.js

const express = require('express');
const cors = require('cors');
// const db = require('./db');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
const api = process.env.REACT_APP_API_URL;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/properties', routes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


