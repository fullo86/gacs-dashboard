export function convertToUTC7(timestamp) {
  const date = new Date(timestamp);

  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Bangkok', // UTC+7
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24 jam
  });

  return formatter.format(date);
}
