import fetch from 'isomorphic-fetch';
import xml2js from 'xml2js';

const convert = (body) =>
  new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      explicitArray: false,
    });
    parser.parseString(body, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });

const organize = (data) => {
  const feed = data.rss.channel;
  const items = feed.item;
  delete feed.item;

  if (feed.image && feed.image.url) {
    feed.image = feed.image.url;
  }
  return { feed, items };
};

export default function parseFeed(url) {
  return fetch(url)
  .then((res) => res.text())
  .then((body) => convert(body))
  .then((json) => organize(json));
}
