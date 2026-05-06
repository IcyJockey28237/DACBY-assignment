const { scrapeHackerNews } = require('../scraper/scraper');

const triggerScrape = async (req, res) => {
  try {
    const stories = await scrapeHackerNews();
    res.status(200).json({ message: 'Scraping successful', count: stories.length, stories });
  } catch (error) {
    res.status(500).json({ message: 'Failed to scrape', error: error.message });
  }
};

module.exports = { triggerScrape };
