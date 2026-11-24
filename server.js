const express = require('express');

const hostname = '127.0.0.1';
const port = 3000;

const app = express(); // raw setHeader + Buffer body: Express 5 res.set()/string send() add '; charset=utf-8' to text/plain
app.get('/', (req, res) => res.status(200).setHeader('Content-Type', 'text/plain').send(Buffer.from('Hello, World!\n')));
app.get('/good-evening', (req, res) => res.status(200).setHeader('Content-Type', 'text/plain').send(Buffer.from('Good evening\n')));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
