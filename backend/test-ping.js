const express = require('express');
const app = express();
app.get('/ping', (req, res) => res.json({ message: 'pong' }));
app.listen(3002, () => console.log('Ping server on 3002'));
