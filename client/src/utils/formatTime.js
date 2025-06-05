// Utility function to format timestamps to local time
export const formatTimeToLocal = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // If it's today
  if (diffInDays === 0) {
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  
  // If it's yesterday
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  
  // If it's within this week
  if (diffInDays < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // If it's older than a week
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

// For message timestamps (more detailed)
export const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
};

// For conversation last message time (shorter format)
export const formatConversationTime = (timestamp) => {
  return formatTimeToLocal(timestamp);
};
