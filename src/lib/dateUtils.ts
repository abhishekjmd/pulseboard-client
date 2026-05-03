/**
 * Utility functions for date formatting to ensure consistency across the application
 * and prevent "Invalid Date" issues.
 */

export function isValidDate(date: any): boolean {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
}

export function formatRelativeTime(dateString: string | Date): string {
  if (!dateString) return "recently";
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "recently";
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 0) return "just now";
  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatShortDate(dateString: string | Date): string {
  if (!isValidDate(dateString)) return "--";
  return new Date(dateString).toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatFullDate(dateString: string | Date): string {
  if (!isValidDate(dateString)) return "--";
  return new Date(dateString).toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}
