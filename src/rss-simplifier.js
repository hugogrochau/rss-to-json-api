import get from 'lodash/get';

export default function simplify(data) {
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
}
