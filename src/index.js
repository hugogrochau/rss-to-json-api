import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json({
  limit: '100kb',
}));

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  res.send({ hello: 'world' });
});

app.listen(3000);

console.log('Listening on port 3000');
