import { useState, useEffect, useRef } from 'react';
import { Search, X, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/Dialog';
import { Input } from './ui/Input';
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-lg mx-4 p-0 bg-card/95 backdrop-blur-md border-border/50 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/30">
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Search
          </DialogTitle>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search conversations or users..."
              className="pl-10 pr-10 bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-border/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>          {/* Results */}
        <div className="max-h-96 overflow-y-auto border-t border-border/30">
          {loading && search.length >= 2 && (
            <div className="p-8 text-center text-muted-foreground">
              <div className="mx-auto mb-4 h-12 w-12 border-2 border-border/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-foreground">Searching for "{search}"</p>
              <p className="text-sm mt-2">Please wait while we find users...</p>
            </div>
          )}

          {search.length >= 2 && !loading && searchResults.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Users className="mx-auto mb-4 h-12 w-12 text-muted-foreground/70" />
              <p className="text-lg font-medium text-foreground">No users found for "{search}"</p>
              <p className="text-sm mt-2">Try searching with a different term</p>
            </div>
          )}

          {search.length > 0 && search.length < 2 && (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-lg font-medium text-foreground">Type at least 2 characters to search</p>
            </div>
          )}

          {search.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/70" />
              <p className="text-lg font-medium text-foreground">Start typing to search</p>
              <p className="text-sm mt-2">Find conversations or discover new users</p>
            </div>
          )}

          {searchResults.map((user, index) => (
            <div
              key={user._id}
              onClick={() => handleSelectUser(user)}
              className={`flex items-center gap-4 p-4 mx-3 my-2 cursor-pointer transition-all duration-200 rounded-lg border border-transparent ${
                index === selectedIndex
                  ? 'bg-primary/90 text-primary-foreground border-primary/30 shadow-md'
                  : selectedConversation?._id === user._id
                  ? 'bg-accent/70 text-accent-foreground border-accent/30'
                  : 'hover:bg-accent/30 hover:border-border/20'
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full ring-2 transition-all duration-200 ${
                  index === selectedIndex
                    ? 'ring-primary-foreground/30'
                    : selectedConversation?._id === user._id
                    ? 'ring-accent-foreground/30'
                    : 'ring-border/50'
                }`}>
                  <img
                    className="w-full h-full object-cover rounded-full"
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
                <p className="font-semibold truncate text-base">
                  {user.fullName}
                </p>
                <p className={`text-sm truncate ${
                  index === selectedIndex 
                    ? 'text-primary-foreground/70' 
                    : 'text-muted-foreground'
                }`}>
                  @{user.username}
                </p>
              </div>

              {selectedConversation?._id === user._id && (
                <div className="text-xs font-medium px-2 py-1 bg-accent/20 text-accent-foreground rounded-full border border-accent/30">
                  Current
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer with keyboard shortcuts */}
        <div className="border-t border-border/30 p-4 bg-muted/20">
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-medium">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              Navigate
            </span>
            <span className="font-medium">↵ Select</span>
            <span className="font-medium">ESC Close</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
