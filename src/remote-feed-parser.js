import fetch from 'isomorphic-fetch';
import xml2js from 'xml2js';
import get from 'lodash/get';

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

  // search for item images
  items.forEach((item) => {
    const mediaContent = get(item, 'media:content');
    let imageUrl;
    // if there are multple media:contents, grab the first
    if (Array.isArray(mediaContent)) {
      const mediaUrl = get(mediaContent, '[0].$.url');
      imageUrl = mediaUrl || imageUrl;
    // otherwise grab the only one
    } else {
      const mediaUrl = get(mediaContent, '$.url');
      imageUrl = mediaUrl || imageUrl;
    }
    // if there's a media:thumbnail defined, prioritize it over all others
    const mediaThumbnailUrl = get(mediaContent, 'media:thumbnail.$.url');
    if (mediaThumbnailUrl) {
      imageUrl = mediaThumbnailUrl || imageUrl;
    }
    item.image = imageUrl;
  });

  return { feed, items };
};

export default function parseFeed(url) {
  return fetch(url)
  .then((res) => res.text())
  .then((body) => convert(body))
  .then((json) => organize(json));
}
