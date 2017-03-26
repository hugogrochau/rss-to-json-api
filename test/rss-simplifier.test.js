import chai from 'chai';
import simplifier from '../src/rss-simplifier';

const expect = chai.expect;
const test = {
  rss: {
    channel: {
      description: 'a',
      item: [
        {
          description: 'b',
        },
        {
          'media:content': {
            'media:thumbnail': {
              $: { url: 'c.jpg' },
            },
          },
        },
        {
          'media:content': {
            $: { url: 'd.jpg' },
          },
        },
        {
          'media:content': [
            { $: { url: 'e.jpg' } },
            { $: { url: 'f.jpg' } },
          ],
        },
      ],
    },
  },
};

describe('rss simplifier', () => {
  let result = {};
  before(() => {
    result = simplifier(test);
  });
  describe('initial', () => {
    it('Should flatten rss.channel', () =>
      expect(result).to.have.deep.property('feed.description', 'a'));

    it('Should parse items', () =>
      expect(result).to.have.deep.property('items[0].description', 'b'));
  });

  describe('Image recognition', () => {
    it('Should use a thumbnail', () =>
    expect(result).to.have.deep.property('items[1].image', 'c.jpg'));

    it('Should use a media:content', () =>
    expect(result).to.have.deep.property('items[2].image', 'd.jpg'));

    it('Should use the first in an array of media:content', () =>
    expect(result).to.have.deep.property('items[3].image', 'e.jpg'));
  });
});
