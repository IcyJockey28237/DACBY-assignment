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

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri && process.env.NODE_ENV !== 'production') {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Using in-memory MongoDB for development/testing');
    }

    if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    // Run scraper initial scrape if stories are empty
    const Story = require('./models/Story');
    const storyCount = await Story.countDocuments();
    if (storyCount === 0) {
        try {
            console.log('No stories found. Running initial scrape...');
            await scrapeHackerNews();
        } catch(err) {
            console.error('Initial scrape failed:', err);
        }
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// For Vercel, we don't always want to call listen
if (process.env.NODE_ENV !== 'production') {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    });
} else {
    // In production (Vercel), we connect to DB but don't call listen
    // Vercel handles the lifecycle
    connectDB();
}

module.exports = app;
