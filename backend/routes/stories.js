const express = require('express');
const router = express.Router();
const { getStories, getStoryById, toggleBookmark, getBookmarkedStories } = require('../controllers/storyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getStories);
router.route('/bookmarks').get(protect, getBookmarkedStories);
router.route('/:id').get(getStoryById);
router.route('/:id/bookmark').post(protect, toggleBookmark);


module.exports = router;
