import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';
import { AuthContext } from '../context/AuthContext';
import { Loader2, RefreshCw } from 'lucide-react';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStories = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await api.get(`/stories?page=${pageNum}&limit=10`);
      setStories(res.data.stories);
      setTotalPages(res.data.pages);
      setPage(res.data.page);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('Error fetching stories:', errorMsg);
      // Optional: Add a state for showing error to user
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookmarks = async () => {
    if (!user) return;
    try {
      const res = await api.get('/stories/bookmarks');
      setUserBookmarks(res.data.map(b => b._id || b));
    } catch (error) {
      console.error('Error fetching bookmarks:', error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchStories(page);
    if (user) {
      fetchUserBookmarks();
    }
  }, [user, page]);

  const handleScrape = async () => {
    try {
      setScraping(true);
      await api.post('/scrape');
      await fetchStories(1);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error('Error scraping stories:', errorMsg);
      alert(`Scrape failed: ${errorMsg}`);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Top Stories</h1>
          <p className="page-subtitle">The latest from Hacker News</p>
        </div>
        <button 
          onClick={handleScrape} 
          disabled={scraping}
          className="btn btn-primary btn-scrape"
        >
          <RefreshCw className={`icon ${scraping ? 'spin' : ''}`} />
          {scraping ? 'Syncing...' : 'Sync Latest'}
        </button>
      </div>

      {loading ? (
        <div className="loader-container">
          <Loader2 className="spinner" size={40} />
          <p>Loading stories...</p>
        </div>
      ) : (
        <>
          <div className="stories-list">
            {stories.map(story => (
              <StoryCard 
                key={story._id} 
                story={story} 
                isBookmarkedInitial={userBookmarks.includes(story._id)}
              />
            ))}
            {stories.length === 0 && (
              <div className="empty-state">No stories found. Try syncing!</div>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="btn btn-outline" 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Previous
              </button>
              <span className="page-info">Page {page} of {totalPages}</span>
              <button 
                className="btn btn-outline" 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
