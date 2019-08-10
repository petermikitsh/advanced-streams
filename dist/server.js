const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

app.post('/', (req, res) => {
  console.log(
    'record_count',
    req.body.records.length,
    'payload_size',
    JSON.stringify(req.body).length
  );
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end('{"ok": "true"}');
});

app.use(express.static(__dirname));

app.listen(8081, () => console.log('Listening on http://0.0.0.0:8081/'));
