import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import parseFeed from './remote-feed-parser';

const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json({
  limit: '100kb',
}));

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.get('/', (req, res) => {
  const url = req.query.rss_url;
  if (!url) {
    return res.send('Please provide a rss_url', 400);
  }
  parseFeed(url)
  .then((parsed) => {
    res.send(parsed);
  });
});

app.listen(3000);

console.log('Listening on port 3000');
