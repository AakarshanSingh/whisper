export const ensureMessagesArray = (messagesData) => {
  if (!messagesData) return [];

  if (Array.isArray(messagesData)) return messagesData;

  return [];
};

export const getDefaultAvatarUrl = (name) => {
  let displayName = name;

  if (
    (typeof name === 'string' && /^[0-9a-fA-F]{24}$/.test(name)) ||
    !isNaN(name)
  ) {
    displayName = 'User';
  } else if (typeof name !== 'string') {
    displayName = String(name || 'User');
  }

  const colors = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#95a5a6',
    '#f39c12',
    '#d35400',
    '#c0392b',
    '#7f8c8d',
  ];

  const hash = displayName.split('').reduce((sum, char) => {
    return sum + char.charCodeAt(0);
  }, 0);

  const colorIndex = hash % colors.length;
  const bgColor = colors[colorIndex];

  const initials = displayName
    .split(' ')
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const displayInitials = initials || 'U';

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

  const base64 = btoa(svg);
  return `data:image/svg+xml;base64,${base64}`;
};
