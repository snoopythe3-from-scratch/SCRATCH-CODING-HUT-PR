
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Get all wikis
app.get('/api/wikis', (req, res) => {
    fs.readFile('./Wiki/wiki.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Failed to read wiki data');
        res.json(JSON.parse(data));
    });
});

// Add a new wiki
app.post('/api/wikis', (req, res) => {
    const newWiki = req.body;

    fs.readFile('./Wiki/wiki.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Failed to read wiki data');
        const wikis = JSON.parse(data);
        wikis.push(newWiki);

        fs.writeFile('./Wiki/wiki.json', JSON.stringify(wikis, null, 2), (err) => {
            if (err) return res.status(500).send('Failed to save wiki data');
            res.status(201).send('Wiki added successfully');
        });
    });
});

// Edit a wiki
app.put('/api/wikis/:title', (req, res) => {
    const title = req.params.title;
    const updatedWiki = req.body;

    fs.readFile('./Wiki/wiki.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Failed to read wiki data');
        let wikis = JSON.parse(data);
        wikis = wikis.map(w => (w.title === title ? updatedWiki : w));

        fs.writeFile('./Wiki/wiki.json', JSON.stringify(wikis, null, 2), (err) => {
            if (err) return res.status(500).send('Failed to save wiki data');
            res.send('Wiki updated successfully');
        });
    });
});

// Delete a wiki
app.delete('/api/wikis/:title', (req, res) => {
    const title = req.params.title;

    fs.readFile('./Wiki/wiki.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Failed to read wiki data');
        const wikis = JSON.parse(data);
        const updatedWikis = wikis.filter(w => w.title !== title);

        fs.writeFile('./Wiki/wiki.json', JSON.stringify(updatedWikis, null, 2), (err) => {
            if (err) return res.status(500).send('Failed to save wiki data');
            res.send('Wiki deleted successfully');
        });
    });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
