
/**
 * Ensures that the messages object is always an array.
 * This helps prevent errors like "messages is not iterable"
 * @param {*} messagesData - The messages data received from the server
 * @returns {Array} - Always returns an array, even if input is null or undefined
 */
export const ensureMessagesArray = (messagesData) => {
  // If messagesData is falsy (null, undefined, etc), return empty array
  if (!messagesData) return [];
  
  // If messagesData is already an array, return it
  if (Array.isArray(messagesData)) return messagesData;
  
  // If somehow we get an object or other type, try to handle it or return empty array
  console.warn('Messages data is not an array:', messagesData);
  return [];
};

/**
 * Utility to generate a default avatar URL when one isn't available
 * @param {string} name - The user's name to generate an avatar for
 * @returns {string} - The URL for the avatar
 */
export const getDefaultAvatarUrl = (name) => {
  // Handle different input types to avoid numeric avatars
  let displayName = name;
  
  // Check if the name is an ID (MongoDB ObjectId format) or a number
  if (typeof name === 'string' && /^[0-9a-fA-F]{24}$/.test(name) || !isNaN(name)) {
    // For IDs, use a default display name
    displayName = 'User';
  } else if (typeof name !== 'string') {
    // Make sure name is a string
    displayName = String(name || 'User');
  }
  
  // Create a unique but consistent color based on the name
  const colors = [
    '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
    '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
    '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
    '#d35400', '#c0392b', '#7f8c8d'
  ];
  
  // Simple hash function to choose a color based on name
  const hash = displayName.split('').reduce((sum, char) => {
    return sum + char.charCodeAt(0);
  }, 0);
  
  const colorIndex = hash % colors.length;
  const bgColor = colors[colorIndex];
  
  // Get initials from the name (with proper handling)
  const initials = displayName
    .split(' ')
    .filter(part => part.length > 0) // filter out empty parts
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
    
  // If no valid initials, use a fallback
  const displayInitials = initials || 'U';
    // Create SVG text avatar
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${bgColor}" />
      <text x="50%" y="50%" dy=".3em" 
        fill="white" 
        font-family="Arial, sans-serif" 
        font-size="42" 
        font-weight="bold" 
        text-anchor="middle">${displayInitials}</text>
    </svg>
  `;
  
  // Convert to base64 for use in image src
  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
};
