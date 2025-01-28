const express = require('express');
const fs = require("fs");
const Util = require('./app/util');
const Database = require('./app/db');
const path = require('path');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// Route to process the CSV file
app.post('/process', (req, res) => {
    let csvPath__env = process.env.csvPath || '';
    const csvPath = path.join(__dirname, 'assets', csvPath__env);
    if (!fs.existsSync(csvPath)) {
        res.status(404).send('File not found' + csvPath);
    }
    const readStream = fs.createReadStream(csvPath, 'utf8');

    const __db = new Database();
    readStream.on('data', (chunk) => {
        let __util = new Util();
        const jsonResult = __util.csv2json(chunk);
        let insert = __db.insert(jsonResult.map((data) => {
            let { name, age, address, ...additionalInfo } = data;

            return {
                name: `${data.name.firstName} ${data.name.lastName}`,
                age: `${data.age}`,
                address: `${JSON.stringify(data.address)}`,
                additional_info: `${JSON.stringify(additionalInfo)}`
            }
        }));
        console.log("Row Insert Status", insert);
        let stat = __db.stat();
        console.log("DB Query", stat);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(stat, null, 3));
    });
    readStream.on('error', (error) => {
        res.status(500).send(error.message);
    });
});

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


