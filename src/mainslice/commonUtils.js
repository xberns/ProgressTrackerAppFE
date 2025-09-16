export function getDateOnly(date = new Date()) {
  return date.toISOString().split('T')[0];
}
