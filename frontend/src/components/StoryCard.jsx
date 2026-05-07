import React, { useContext, useState } from 'react';
import { Bookmark, ExternalLink, Clock, User, ChevronUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const StoryCard = ({ story, isBookmarkedInitial, onBookmarkToggle }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(isBookmarkedInitial);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setLoading(true);
      await api.post(`/stories/${story._id}/bookmark`);
      setIsBookmarked(!isBookmarked);
      if (onBookmarkToggle) {
        onBookmarkToggle(story._id);
      }
    } catch (error) {
      console.error('Error toggling bookmark', error);
    } finally {
      setLoading(false);
    }
  };

  const timeAgo = (dateString) => {
    // Handling standard date parsing (dateString is ISO string)
    const date = new Date(dateString);
    if(isNaN(date)) return dateString; // fallback if it's "2 hours ago" text directly from Hacker News
    
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  // HackerNews sometimes provides the postedAt as "2023-10-10T12:00:00 1696939200" (ISO string + Unix timestamp).
  // We'll try to extract just the ISO part to parse it cleanly.
  let cleanDateString = story.postedAt;
  const isoMatch = cleanDateString.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
  if (isoMatch) {
    cleanDateString = isoMatch[1];
  }

  const displayTime = isNaN(new Date(cleanDateString)) ? story.postedAt : timeAgo(cleanDateString);

  return (
    <div className="story-card">
      <div className="story-points">
        <ChevronUp className="points-icon" />
        <span>{story.points}</span>
      </div>
      <div className="story-content">
        <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-title">
          {story.title}
          <ExternalLink className="link-icon" size={14} />
        </a>
        <div className="story-meta">
          <span className="meta-item">
            <User size={14} />
            {story.author}
          </span>
          <span className="meta-item">
            <Clock size={14} />
            {displayTime}
          </span>
        </div>
      </div>
      <div className="story-actions">
        <button 
          onClick={handleBookmark} 
          className={`bookmark-btn ${isBookmarked ? 'active' : ''} ${loading ? 'loading' : ''}`}
          title={isBookmarked ? "Remove Bookmark" : "Bookmark Story"}
          disabled={loading}
        >
          <Bookmark className="bookmark-icon" fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
