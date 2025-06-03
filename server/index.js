//index.js

const express = require('express');
const cors = require('cors');
const db = require('./db');
const routes = require('./routes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/api/properties', routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


