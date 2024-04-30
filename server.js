// server.js
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'data.json');

app.get('/', async (req, res) => {
    try {
        const html = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');
        res.send(html);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/api/data', async (req, res) => {
    const newData = req.body;
    try {
        let existingData = [];
        try {
            const fileContent = await fs.readFile(DATA_FILE, 'utf8');
            existingData = JSON.parse(fileContent);
        } catch (error) {
            console.error("Error reading data file:", error);
        }
        existingData.push(newData);
        await fs.writeFile(DATA_FILE, JSON.stringify(existingData, null, 2));
        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: 'Failed to save data.' });
    }
});

app.get('/api/data', async (req, res) => {
    try {
        const fileContent = await fs.readFile(DATA_FILE, 'utf8');
        const data = JSON.parse(fileContent);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error reading data file:", error);
        res.status(500).json({ message: 'Failed to retrieve data.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
