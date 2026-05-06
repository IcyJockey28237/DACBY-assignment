const Story = require('../models/Story');
const User = require('../models/User');

const getStories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const stories = await Story.find({})
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Story.countDocuments();

    res.json({
      stories,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ message: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const storyId = req.params.id;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    const index = user.bookmarks.indexOf(storyId);
    if (index === -1) {
      // Add bookmark
      user.bookmarks.push(storyId);
    } else {
      // Remove bookmark
      user.bookmarks.splice(index, 1);
    }

    await user.save();
    
    // Return populated bookmarks
    const updatedUser = await User.findById(req.user._id).populate('bookmarks');
    res.json(updatedUser.bookmarks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookmarkedStories = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('bookmarks');
        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(user.bookmarks);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getStories, getStoryById, toggleBookmark, getBookmarkedStories };
