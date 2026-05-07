import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Terminal, Bookmark, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Terminal className="logo-icon" />
          <span>HackNews</span>
        </Link>
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/bookmarks" className="nav-link">
                <Bookmark className="nav-icon" />
                Bookmarks
              </Link>
              <div className="user-profile">
                <UserIcon className="nav-icon" />
                <span>{user.username}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-logout">
                <LogOut className="nav-icon" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
