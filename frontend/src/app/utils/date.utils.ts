export function formatBirthDate(date: unknown): string {
  if (!date) return "Unknown";

  if (typeof date === 'string') {
    return date.split('T')[0];
  }

  if (date instanceof Date && !isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  return "Unknown";
}