const http = require('http');

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  if ( req.method === 'POST') {
    let body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      console.log(
        'record_count',
        JSON.parse(body).records.length,
        'payload_size',
        body.length
      );
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end('{"ok": "true"}');
    });
  }
}).listen(8081, () => {
  console.log('Listening on http://0.0.0.0:8081/');
});
