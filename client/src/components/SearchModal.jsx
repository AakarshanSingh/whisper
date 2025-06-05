import { useState, useEffect, useRef } from 'react';
import { CiSearch } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import { HiUserGroup } from 'react-icons/hi';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import useConversation from '../zustand/useConversation';
import useGetConversations from '../hooks/useGetConversations';
import useDebounce from '../hooks/useDebounce';
import { toast } from 'react-toastify';
import { getDefaultAvatarUrl } from '../utils/messageDebug';
import { SERVER_URL } from '../global';

const SearchModal = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const { setSelectedConversation, selectedConversation } = useConversation();
  const { conversations } = useGetConversations();
  const searchRef = useRef(null);
  const modalRef = useRef(null);
  
  // Debounce search input with 300ms delay
  const debouncedSearch = useDebounce(search, 300);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Perform search when debounced value changes
  useEffect(() => {
    if (debouncedSearch.trim().length >= 2) {
      setLoading(true);
      performSearch(debouncedSearch);
    } else {
      setSearchResults([]);
      setIsSearching(false);
      setSelectedIndex(-1);
    }
  }, [debouncedSearch, conversations]);

  // Search function
  const performSearch = async (searchTerm) => {
    try {
      const normalizedSearch = searchTerm.toLowerCase().trim();
      
      // First search in existing conversations
      const conversationResults = conversations
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
          const aName = a.fullName?.toLowerCase() || '';
          const bName = b.fullName?.toLowerCase() || '';
          
          const aStartsWith = aName.startsWith(normalizedSearch);
          const bStartsWith = bName.startsWith(normalizedSearch);
          
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          
          return aName.localeCompare(bName);
        });

      // If we have conversation results, use them
      if (conversationResults.length > 0) {
        setSearchResults(conversationResults.slice(0, 8));
        setIsSearching(true);
        setSelectedIndex(-1);
        setLoading(false);
        return;
      }

      // If no conversation results, search all users
      const token = JSON.parse(localStorage.getItem('whisper'))?.token;
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${SERVER_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const allUsers = await response.json();
      
      const userResults = allUsers
        .filter((user) => {
          const fullName = user.fullName?.toLowerCase() || '';
          const username = user.username?.toLowerCase() || '';
          
          return (
            fullName.includes(normalizedSearch) ||
            username.includes(normalizedSearch) ||
            fullName.startsWith(normalizedSearch) ||
            username.startsWith(normalizedSearch)
          );
        })
        .sort((a, b) => {
          const aName = a.fullName?.toLowerCase() || '';
          const bName = b.fullName?.toLowerCase() || '';
          
          const aStartsWith = aName.startsWith(normalizedSearch);
          const bStartsWith = bName.startsWith(normalizedSearch);
          
          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;
          
          return aName.localeCompare(bName);
        });

      setSearchResults(userResults.slice(0, 8));
      setIsSearching(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && searchResults[selectedIndex]) {
          handleSelectUser(searchResults[selectedIndex]);
        }
        break;
    }
  };

  // Handle user selection
  const handleSelectUser = (user) => {
    if (user._id === selectedConversation?._id) {
      onClose();
      return;
    }

    setSelectedConversation(user);
    setSearch('');
    setSearchResults([]);
    setIsSearching(false);
    setSelectedIndex(-1);
    onClose();
  };

  // Reset modal state when closing
  const handleClose = () => {
    setSearch('');
    setSearchResults([]);
    setIsSearching(false);
    setSelectedIndex(-1);
    onClose();
  };

  if (!isOpen) return null;  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-lg mx-4 bg-gray-800 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden transform transition-all duration-200 scale-100 translate-y-0"
        style={{
          animation: 'slideInFromTop 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Search</h2>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-full transition-all duration-200"
            >
              <IoCloseOutline size={24} />
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative">
            <CiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search conversations or users..."
              className="w-full pl-12 pr-4 py-3 bg-gray-700/50 text-gray-100 rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {search.length >= 2 && !loading && searchResults.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              <HiUserGroup className="mx-auto mb-3 text-3xl" />
              <p>No users found for "{search}"</p>
            </div>
          )}

          {search.length > 0 && search.length < 2 && (
            <div className="p-6 text-center text-gray-400">
              <p>Type at least 2 characters to search</p>
            </div>
          )}

          {search.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              <CiSearch className="mx-auto mb-3 text-3xl" />
              <p>Start typing to search for conversations or users</p>
            </div>
          )}

          {searchResults.map((user, index) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`flex items-center gap-3 p-4 mx-2 my-1 cursor-pointer transition-all duration-200 rounded-xl ${
                index === selectedIndex
                  ? 'bg-blue-600/20 border-l-4 border-blue-500'
                  : selectedConversation?._id === user._id
                  ? 'bg-green-600/20 border-l-4 border-green-500'
                  : 'hover:bg-gray-700/50'
              }`}
            >
              <div className="avatar">
                <div className="w-12 h-12 rounded-full ring-2 ring-gray-600/50">
                  <img
                    src={user.profilePic || getDefaultAvatarUrl(user.fullName)}
                    alt={user.fullName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getDefaultAvatarUrl(user.fullName);
                    }}
                  />
                </div>
              </div>
              
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-semibold text-gray-100 truncate">
                  {user.fullName}
                </p>
                <p className="text-sm text-gray-400 truncate">
                  @{user.username}
                </p>
              </div>

              {selectedConversation?._id === user._id && (
                <div className="text-green-500 text-sm font-medium">
                  Current
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer with keyboard shortcuts */}
        <div className="p-4 bg-gray-800/50 border-t border-gray-700/50 text-xs text-gray-400">
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <RiArrowUpSLine className="text-sm" />
              <RiArrowDownSLine className="text-sm" />
              Navigate
            </span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
