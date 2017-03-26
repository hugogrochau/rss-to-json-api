import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import parseFeed from './remote-feed-parser';

const app = express();
app.server = http.createServer(app);

app.use(bodyParser.json({
  limit: '100kb',
}));

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(cors({
  exposedHeaders: ['Link'],
}));

app.get('/', (req, res) => {
  const url = decodeURIComponent(req.query.rss_url);
  if (!url) {
    return res.status(400).send('Please provide a rss_url');
  }
  parseFeed(url)
  .then((parsed) => {
    // TODO cache here
    res.status(200).send({ status: 'ok', ...parsed });
  })
  .catch((err) => res.status(err.code).send({ status: 'error', message: err.message }));
});

app.listen(3000);

console.log('Listening on port 3000');
