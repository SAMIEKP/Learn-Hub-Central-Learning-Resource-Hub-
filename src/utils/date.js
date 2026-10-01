import { format, formatDistanceToNow, isValid } from 'date-fns';

export function formatDate(value, pattern = 'd MMM yyyy') {
  const date = value instanceof Date ? value : new Date(value);
  return isValid(date) ? format(date, pattern) : '—';
}

export function formatRelativeDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : '—';
}

export function toDateInputValue(value = new Date()) {
  return format(value instanceof Date ? value : new Date(value), 'yyyy-MM-dd');
}
