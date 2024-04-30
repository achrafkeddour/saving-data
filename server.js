// server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

// Serve the index.html file
app.get('/', async (req, res) => {
    try {
        const html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');
        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

// API endpoint to handle form submission
app.post('/api/data', async (req, res) => {
    const data = req.body;
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to save data.' });
    }
});

// API endpoint to retrieve saved data
app.get('/api/data', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.status(200).json(JSON.parse(data));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve data.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
