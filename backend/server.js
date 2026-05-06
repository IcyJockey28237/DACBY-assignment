require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const storyRoutes = require('./routes/stories');
const scrapeRoutes = require('./routes/scrape');
const { scrapeHackerNews } = require('./scraper/scraper');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/scrape', scrapeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const { MongoMemoryServer } = require('mongodb-memory-server');

const startServer = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    // We will use memory server for testing
    const mongoServer = await MongoMemoryServer.create();
    mongoUri = mongoServer.getUri();
    console.log('Using in-memory MongoDB for testing');

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    // Run scraper automatically on server start
    try {
        console.log('Running initial scrape...');
        await scrapeHackerNews();
    } catch(err) {
        console.error('Initial scrape failed:', err);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

startServer();
