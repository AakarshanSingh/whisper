import { useState, useEffect, useRef } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import { HiUserGroup } from 'react-icons/hi';
import useConversation from '../zustand/useConversation';
import useGetConversations from '../hooks/useGetConversations';
import useDebounce from '../hooks/useDebounce';
import { toast } from 'react-toastify';
import { getDefaultAvatarUrl } from '../utils/messageDebug';

const SearchInput = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const { setSelectedConversation, selectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Debounce search input with 300ms delay (like Telegram)
  const debouncedSearch = useDebounce(search, 300);

  // Perform search when debounced value changes
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      setLoading(true);
      performSearch(debouncedSearch);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
      setSelectedIndex(-1);
    }
  }, [debouncedSearch, conversations]);

  // Search function with improved filtering
  const performSearch = (searchTerm) => {
    try {
      const normalizedSearch = searchTerm.toLowerCase().trim();
      
      const results = conversations
        .filter((conversation) => {
          const fullName = conversation.fullName?.toLowerCase() || '';
          const username = conversation.username?.toLowerCase() || '';
          
          return (
            fullName.includes(normalizedSearch) ||
            username.includes(normalizedSearch) ||
            fullName.startsWith(normalizedSearch) ||
            username.startsWith(normalizedSearch)
          );
        })
        .sort((a, b) => {
          // Prioritize exact matches and starting matches
          const aName = a.fullName?.toLowerCase() || '';
          const bName = b.fullName?.toLowerCase() || '';
          
          const aStartsWith = aName.startsWith(normalizedSearch);
          const bStartsWith = bName.startsWith(normalizedSearch);
          
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          
          return aName.localeCompare(bName);
        })
        .slice(0, 8); // Limit to 8 results for better UX
      
      setSearchResults(results);
      setShowDropdown(true);
      setIsSearching(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown || searchResults.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleSelectConversation(searchResults[selectedIndex]);
        } else if (searchResults.length === 1) {
          handleSelectConversation(searchResults[0]);
        }
        break;
      case 'Escape':
        clearSearch();
        searchRef.current?.blur();
        break;
    }
  };

  // Handle selection of search result
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setSearch('');
    setSearchResults([]);
    setShowDropdown(false);
    setIsSearching(false);
    setSelectedIndex(-1);
    searchRef.current?.blur();
    
    toast.success(`Opened chat with ${conversation.fullName}`, {
      autoClose: 2000,
      hideProgressBar: true,
    });
  };
  
  // Clear search
  const clearSearch = () => {
    setSearch('');
    setSearchResults([]);
    setShowDropdown(false);
    setIsSearching(false);
    setSelectedIndex(-1);
  };

  // Handle input focus
  const handleFocus = () => {
    if (search.trim().length >= 2 && searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !searchRef.current?.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highlight matching text
  const highlightMatch = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-blue-500/30 text-blue-300 font-semibold">
          {part}
        </span>
      ) : part
    );
  };  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="w-full bg-gray-800/70 text-gray-100 rounded-2xl h-12 pl-12 pr-12 border border-gray-600/50 focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 placeholder-gray-400 backdrop-blur-sm hover:bg-gray-800/90 focus:bg-gray-800"
        />
        
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <CiSearch className={`w-5 h-5 transition-all duration-200 ${
            search ? 'text-blue-400 scale-110' : 'text-gray-400'
          }`} />
        </div>
        
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-y-0 right-12 flex items-center">
            <div className="loading loading-spinner loading-sm text-blue-400"></div>
          </div>
        )}
        
        {/* Clear Button */}
        {search && !loading && (
          <button 
            type="button" 
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-400 hover:scale-110 transition-all duration-200 rounded-full group"
            title="Clear search"
          >
            <IoCloseOutline className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        )}
      </div>
      
      {/* Enhanced dropdown results */}
      {showDropdown && (
        <div className="absolute z-30 mt-3 w-full bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-600/50 max-h-80 overflow-hidden backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
          {searchResults.length > 0 ? (
            <>
              <div className="px-4 py-2 border-b border-gray-700/50 bg-gray-700/30">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                  {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'}
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                {searchResults.map((conversation, index) => (
                  <div 
                    key={conversation._id} 
                    onClick={() => handleSelectConversation(conversation)}
                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 transition-all duration-150 group relative ${
                      selectedIndex === index 
                        ? 'bg-blue-600/20 border-l-4 border-blue-500' 
                        : 'hover:bg-gray-700/50 hover:translate-x-1'
                    } ${
                      selectedConversation?._id === conversation._id 
                        ? 'bg-green-600/10 border-l-4 border-green-500' 
                        : ''
                    }`}
                  >
                    <div className="avatar flex-shrink-0">
                      <div className={`w-11 h-11 rounded-full ring-2 transition-all duration-200 ${
                        selectedIndex === index 
                          ? 'ring-blue-400 scale-105' 
                          : 'ring-gray-600 group-hover:ring-blue-400/50'
                      }`}>
                        <img 
                          src={conversation.profilePic || getDefaultAvatarUrl(conversation.fullName)}
                          alt={conversation.fullName}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getDefaultAvatarUrl(conversation.fullName || "User");
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className={`font-medium transition-colors duration-200 truncate ${
                        selectedIndex === index 
                          ? 'text-blue-300' 
                          : 'text-gray-100 group-hover:text-blue-400'
                      }`}>
                        {highlightMatch(conversation.fullName, debouncedSearch)}
                      </span>
                      <span className="text-xs text-gray-400 truncate">
                        {selectedConversation?._id === conversation._id 
                          ? '✓ Current conversation' 
                          : 'Click to open chat'
                        }
                      </span>
                    </div>
                    
                    <div className={`flex-shrink-0 transition-all duration-200 ${
                      selectedIndex === index 
                        ? 'opacity-100 scale-110' 
                        : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    
                    {/* Keyboard hint */}
                    {selectedIndex === index && (
                      <div className="absolute top-1 right-1 text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
                        Enter
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Footer with shortcuts */}
              <div className="px-4 py-2 border-t border-gray-700/50 bg-gray-700/30">
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Use ↑↓ to navigate</span>
                  <span>Enter to select • Esc to close</span>
                </div>
              </div>
            </>
          ) : (
            /* No results state */
            <div className="p-6 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center">
                  <HiUserGroup className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-300 font-medium">No conversations found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Try searching with a different name
                  </p>
                </div>
                {debouncedSearch.length < 2 && (
                  <p className="text-gray-600 text-xs">
                    Type at least 2 characters to search
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
