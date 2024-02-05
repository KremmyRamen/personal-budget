const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs');

app.use(cors());

// Read data from the JSON file
const rawData = fs.readFileSync('new.json');
const budget = JSON.parse(rawData);

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello, this is the root path!');
});

app.get('/budget', (req, res) => {
    res.json(budget);
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});

