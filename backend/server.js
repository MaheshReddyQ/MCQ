const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 8001; // Replace with your desired port number
const pool = new Pool({
    user: 'postgres', // Replace with your PostgreSQL username
    host: 'localhost',
    database: 'storereact', // Replace with your PostgreSQL database name
    password: '2580', // Replace with your PostgreSQL password
    port: 5432, // PostgreSQL default port is 5432
});

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Test the database connection (optional)
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to PostgreSQL database:', res.rows[0].now);
    }
});

// Route to store the result in the PostgreSQL database
app.post('/api/store-result', async (req, res) => {
    const { name, score } = req.body;

    try {
        const query = `
      INSERT INTO results (name, score)
      VALUES ($1, $2)
    `;
        const values = [name, score];

        await pool.query(query, values);
        console.log('Result saved successfully!');
        res.status(200).json({ message: 'Result saved successfully!' });
    } catch (error) {
        console.error('Error saving result:', error);
        res.status(500).json({ error: 'Error saving result' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
