import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSearch } from '../../context/SearchContext';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

// SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.3-4.3"/>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.41 1.41"/>
    <path d="m17.66 17.66 1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m6.34 17.66-1.41 1.41"/>
    <path d="m19.07 4.93-1.41 1.41"/>
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export function Navbar() {
  const { profile, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const { isDark, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const goBack = () => {
    window.history.back();
  };

  const goForward = () => {
    window.history.forward();
  };

  const getUserInitial = () => {
    if (profile?.first_name) {
      return profile.first_name.charAt(0).toUpperCase();
    }
    if (profile?.email) {
      return profile.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Empty left section for balance */}
      </div>

      <div className="navbar-center">
        {/* Search bar - centered */}
        <div className="search-container">
          <span className="search-icon">
            <SearchIcon />
          </span>
          <input
            ref={searchInputRef}
            type="text"
            className="search-input"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-shortcut">{shortcutKey}</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Theme toggle */}
        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* User avatar */}
        <div className="user-dropdown" ref={dropdownRef}>
          <button
            className="user-avatar-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span className="user-avatar">{getUserInitial()}</span>
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-header">
                <span className="dropdown-name">
                  {profile?.first_name} {profile?.last_name}
                </span>
                <span className="dropdown-email">{profile?.email}</span>
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={handleLogout}>
                <LogoutIcon />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
