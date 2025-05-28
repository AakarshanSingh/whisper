import { useState, useEffect, useRef } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import useConversation from '../zustand/useConversation';
import useGetConversations from '../hooks/useGetConversations';
import { toast } from 'react-toastify';
import { getDefaultAvatarUrl } from '../utils/messageDebug';

const SearchInput = () => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  // Fixed the missing parentheses here - this was causing the chat selection issue
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  const debounceTimerRef = useRef(null);
  // Debounced search function
  const performSearch = (searchTerm) => {
    if (!searchTerm) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const results = conversations.filter((c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(results);
    setIsSearching(true);
  };

  // Handle search input changes with debouncing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    if (search) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(search);
      }, 300); // 300ms debounce delay (like Telegram)
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
    
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [search, conversations]);
  
  // Handle selection of search result
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setSearch('');
    setSearchResults([]);
    setIsSearching(false);
  };
  
  // Clear search
  const clearSearch = () => {
    setSearch('');
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 2) {
      return toast.error('Please enter at least 2 characters');
    }
    
    const conversation = conversations.find((c) =>
      c.fullName.toLowerCase().includes(search.toLowerCase())
    );

    if (conversation) {
      setSelectedConversation(conversation);
      setSearch('');
      setIsSearching(false);
    } else {
      toast.error('No user found');
    }
  };
  return (
    <div className="relative w-full">
      <form className="flex items-center gap-2" onSubmit={handleSubmit}>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full input-bordered rounded-full h-10 bg-primary border-secondary pl-10 pr-10 focus:border-message focus:ring-1 focus:ring-message transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <CiSearch className="w-5 h-5 text-gray-400" />
          </div>
          {search && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
            >
              <IoCloseOutline className="w-5 h-5" />
            </button>
          )}
        </div>
        <button type="submit" className="btn btn-circle bg-message hover:bg-blue-600 text-white border-none">
          <CiSearch className="w-6 h-6" />
        </button>
      </form>
      
      {/* Telegram-like dropdown results */}
      {isSearching && searchResults.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-secondary rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <ul className="py-2">
            {searchResults.map(conversation => (
              <li 
                key={conversation._id} 
                onClick={() => handleSelectConversation(conversation)}
                className="px-4 py-2 hover:bg-primary cursor-pointer flex items-center gap-3 transition-colors"
              >                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img 
                      src={conversation.profilePic || getDefaultAvatarUrl(conversation.fullName)}
                      alt={conversation.fullName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getDefaultAvatarUrl(conversation.fullName || "User");
                      }}
                    />
                  </div>
                </div>
                <span className="text-textColor">{conversation.fullName}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* No results message */}
      {isSearching && search.length >= 2 && searchResults.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-secondary rounded-lg shadow-lg p-4 text-center">
          <p className="text-gray-300">No contacts found matching "{search}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
