const express = require('express');

const hostname = '127.0.0.1';
const port = 3000;

const app = express();
// Bare text/plain: res.type/res.send would append charset=utf-8 and an ETag, changing the delivered contract.
const sendText = (res, body) => res.setHeader('Content-Type', 'text/plain').end(body);

app.get('/', (req, res) => sendText(res, 'Hello, World!\n'));
app.get('/good-evening', (req, res) => sendText(res, 'Good evening\n'));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
