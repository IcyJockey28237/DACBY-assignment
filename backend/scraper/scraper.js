const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const scrapeHackerNews = async () => {
  try {
    const { data } = await axios.get('https://news.ycombinator.com/');
    const $ = cheerio.load(data);
    const stories = [];

    // Hacker News puts the title, url in a tr with class 'athing'
    // and points, author, time in the next tr
    $('.athing').each((i, element) => {
      if (i >= 10) return false; // Get only top 10

      const id = $(element).attr('id');
      const titleElement = $(element).find('.titleline > a');
      const title = titleElement.text();
      const url = titleElement.attr('href');

      const subtextElement = $(element).next();
      const pointsText = subtextElement.find('.score').text();
      const points = pointsText ? parseInt(pointsText.replace(/\D/g, '')) : 0;
      
      const author = subtextElement.find('.hnuser').text() || 'anonymous';
      const postedAt = subtextElement.find('.age').attr('title') || subtextElement.find('.age > a').text() || new Date().toISOString();

      stories.push({
        title,
        url: url && url.startsWith('item?id=') ? `https://news.ycombinator.com/${url}` : url,
        points,
        author,
        postedAt,
        hnId: id
      });
    });

    // Save to MongoDB
    const savePromises = stories.map(async (storyData) => {
      if (!storyData.title || !storyData.url) {
        console.warn('Skipping story due to missing data:', storyData);
        return;
      }
      
      return Story.findOneAndUpdate(
        { hnId: storyData.hnId },
        storyData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    });

    await Promise.all(savePromises);

    console.log(`Successfully processed ${stories.length} Hacker News stories.`);
    return stories;
  } catch (error) {
    console.error('Error scraping Hacker News:', error);
    throw error;
  }
};

module.exports = { scrapeHackerNews };
