export default function timestampsdt(date) {
  const dt = new Date() - date;
  const seconds = Math.floor(dt / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  var timestamp = '';

  if (years > 0) {
    timestamp = `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    timestamp = `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    timestamp = `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    timestamp = `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    timestamp = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    timestamp = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  }
  
  return timestamp;
}
