import fetch from 'isomorphic-fetch';
import xml2js from 'xml2js';
import simplify from './rss-simplifier';

const convert = (body) =>
  new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({
      explicitArray: false,
    });
    parser.parseString(body, (err, data) => {
      // if there was a parse error
      if (err) return reject(err);
      // if it's not a rss xml
      if (!data.rss) return reject('Invalid RSS feed');
      return resolve(data);
    });
  });

export default function parseFeed(url) {
  return fetch(url)
  .then((res) => res.text())
  // convert from xml to json
  .then((body) => convert(body))
  .then((json) => simplify(json))
  .catch((err) => {
    if (err && err.code === 'ENOTFOUND') {
      return Promise.reject({ code: 404, message: 'Could not access the feed' });
    }
    return Promise.reject({ code: 400, message: 'Invalid RSS feed' });
  });
}
