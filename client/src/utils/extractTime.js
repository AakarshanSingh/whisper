import { formatMessageTime } from './formatTime';

export function extractTime(dateString) {
  // Use the new formatMessageTime function for better local time formatting
  return formatMessageTime(dateString);
}

// Keep the old function for backward compatibility
export function extractTimeOld(dateString) {
  const date = new Date(dateString);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
}

function padZero(number) {
  return number.toString().padStart(2, '0');
}
