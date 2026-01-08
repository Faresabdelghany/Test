import { createContext, useContext, useState, useCallback } from 'react';

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('');

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const value = {
    searchQuery,
    setSearchQuery,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
