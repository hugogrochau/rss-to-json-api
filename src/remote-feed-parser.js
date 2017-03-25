import fetch from 'isomorphic-fetch';
import htmlParser from 'htmlparser2';

const feedParser = (body) => {
  const result = { feed: {}, items: [] };
  const validTags = ['title', 'link', 'description', 'pubDate', 'image', 'thumbnail'];

  let isInsidePropertyTag = false;
  let isInsideItem = false;
  let currentTag = '';
  let currentItem = {};

  const parser = new htmlParser.Parser({
    onopentag(name) {
      if (name === 'item') {
        isInsideItem = true;
      } else if (validTags.includes(name)) {
        currentTag = name;
        isInsidePropertyTag = true;
      }
    },
    ontext(text) {
      if (isInsidePropertyTag) {
        if (isInsideItem) {
          currentItem[currentTag] = text;
        } else {
          result.feed[currentTag] = text;
        }
      }
    },
    onclosetag(name) {
      if (isInsideItem && name === 'item') {
        result.items.push(currentItem);
        isInsideItem = false;
        currentItem = {};
      } else if (isInsidePropertyTag && name === currentTag) {
        currentTag = '';
        isInsidePropertyTag = false;
      }
    },
  }, {
    xmlMode: true,
  });
  parser.write(body);
  return result;
};

export default function parseFeed(url) {
  return fetch(url)
  .then((res) => res.text())
  .then((body) => feedParser(body));
}
