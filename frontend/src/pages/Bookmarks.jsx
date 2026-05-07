import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';
import { Loader2, BookmarkX } from 'lucide-react';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/stories/bookmarks');
      setBookmarks(res.data);
    } catch (error) {
      console.error('Error fetching bookmarks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = (storyId) => {
    // If we untoggle a bookmark in the bookmarks page, we might want to remove it from the list
    // Or just let it be inactive. Let's remove it for better UX.
    setBookmarks(bookmarks.filter(b => b._id !== storyId));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Your Bookmarks</h1>
          <p className="page-subtitle">Stories you've saved for later</p>
        </div>
      </div>

      {loading ? (
        <div className="loader-container">
          <Loader2 className="spinner" size={40} />
          <p>Loading bookmarks...</p>
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="stories-list">
          {bookmarks.map(story => (
            <StoryCard 
              key={story._id} 
              story={story} 
              isBookmarkedInitial={true}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookmarkX size={48} className="empty-icon" />
          <h3>No bookmarks yet</h3>
          <p>Go to the home page and save some stories!</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
