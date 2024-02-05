// Budget API

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());

const dataPath = path.join(__dirname, 'new.json');

app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello, this is the root path!');
});

app.get('/budget', (req, res) => {
    // Read the JSON file
    fs.readFile(dataPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const budgetData = JSON.parse(data);
        res.json(budgetData);
    });
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
