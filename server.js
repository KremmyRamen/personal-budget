const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/personalBudgetDB';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const budgetSchema = new mongoose.Schema({
    title: { type: String, required: true },
    relatedValue: { type: Number, required: true },
    color: { 
      type: String, 
      required: true, 
      validate: [/^#([0-9a-fA-F]{6})$/, 'Invalid color format']
    }
  });

const Budget = mongoose.model('Budget', budgetSchema);

// Create a new MongoClient
const client = new MongoClient(uri);

async function main() {
    try {
        // Connect to the MongoDB client
        await client.connect();
        console.log('Connected to MongoDB');

        // Start the Express server
        app.listen(port, () => {
            console.log(`API served at http://localhost:${port}`);
        });
    } catch (e) {
        console.error(e);
    }
}

// Call the main function to connect to the database and start the server
main().catch(console.error);

app.use(cors());
app.use('/', express.static('public'));

app.get('/hello', (req, res) => {
    res.send('Hello, this is the root path!');
});

app.get('/budget', async (req, res) => {
    try {
        const database = client.db('personalBudgetDB');
        const collection = database.collection('budget');
        const budgetDocument = await collection.findOne({ myBudget: { $exists: true } });
        
        if (budgetDocument && budgetDocument.myBudget) {
            res.json(budgetDocument.myBudget);
        } else {
            res.status(404).send('Budget data not found');
        }
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        res.status(500).send('Error fetching data');
    }
});

app.use(express.json());
app.post('/budget', async (req, res) => {
    try {
      const newEntry = new Budget(req.body); // This creates a new document
      const result = await newEntry.save(); // This saves the new document
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
