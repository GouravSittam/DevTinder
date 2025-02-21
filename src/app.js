const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Hello, Gourav!");
});

app.get('/test', (req, res) => {
    res.send("Hello, hello!");
});

app.get('/server', (req, res) => {
    res.send("Greetings from the server!");
});

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777.");
});