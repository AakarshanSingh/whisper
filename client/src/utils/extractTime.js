import { formatMessageTime } from './formatTime';

export function extractTime(dateString) {
  return formatMessageTime(dateString);
}

export function extractTimeOld(dateString) {
  const date = new Date(dateString);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
}

function padZero(number) {
  return number.toString().padStart(2, '0');
}
