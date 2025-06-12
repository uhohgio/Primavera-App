// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'primavera_property_manager_user', // database user
  host: 'oregon-postgres.render.com', // Render's PostgreSQL host
  database: 'primavera_property_manager', //  database name
  password: 'yTdcHcfU8pMitxnWIQz6dhRuIGu2x0uY', // database password
  port: 5432, // default PostgreSQL port
  ssl: {
    rejectUnauthorized: false, // needed for Render
  },
});

// const result = await pool.query('SELECT * FROM properties')
//   .then(res => console.log(res.rows))
//   .catch(err => console.error('Error executing query', err.stack));
//   // This allows you to use the pool in other parts of your application

// // Log the result to verify connection
// console.log(result.rows);
// // Create table if it doesn't exist
// const newTable = await pool.query(`
//   CREATE TABLE IF NOT EXISTS properties (
//     id SERIAL PRIMARY KEY,
//     address TEXT NOT NULL,
//     tenant TEXT,
//     rent INTEGER
//   )
// `)
//   .then(() => console.log('Table created or already exists'))
//   .catch(err => console.error('Error creating table:', err));

// console.log(newTable);

// // Export the pool for use in other modules
// pool.on('connect', () => {
//   console.log('Connected to the database');
// });
// pool.on('error', (err) => {
//   console.error('Unexpected error on idle client', err);
// });
// // Function to close the pool when the application exits
// pool.on('end', () => {
//   console.log('Database connection closed');
// });




module.exports = pool;


