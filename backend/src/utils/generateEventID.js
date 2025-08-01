export const generateEventId = () => {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
                  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

  const now = new Date();
  const MMM = months[now.getMonth()];
  const YYYY = now.getFullYear();

  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();

  return `EVT-${MMM}${YYYY}-${randomStr}`;
};
