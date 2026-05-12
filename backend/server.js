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

  let mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri && process.env.NODE_ENV !== 'production') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Using in-memory MongoDB for development/testing');
    } catch (err) {
      console.error('Failed to create MongoMemoryServer:', err);
    }
  }

  if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined. Please check your environment variables.');
  }

  try {
    // Set some options for better serverless behavior
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
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
    throw new Error(`Failed to connect to MongoDB: ${err.message}`);
  }
};

app.use(cors());
app.use(express.json());

// Middleware to ensure DB is connected before handling routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        // Pass the error to the global error handler
        res.status(503);
        next(err);
    }
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
