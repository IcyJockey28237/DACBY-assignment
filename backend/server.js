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

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri && process.env.NODE_ENV !== 'production') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Using in-memory MongoDB for development/testing');
    }

    if (!mongoUri) {
        console.error('MONGODB_URI is not defined');
        return;
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    // Background task for initial scrape if stories are empty
    const runInitialScrape = async () => {
        try {
            const Story = require('./models/Story');
            const storyCount = await Story.countDocuments();
            if (storyCount === 0) {
                console.log('No stories found. Running initial scrape...');
                await scrapeHackerNews();
            }
        } catch (err) {
            console.error('Initial scrape task failed:', err);
        }
    };
    
    runInitialScrape();
    
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

app.use(cors());
app.use(express.json());

// Middleware to ensure DB is connected before handling routes
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/scrape', scrapeRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
}

module.exports = app;
