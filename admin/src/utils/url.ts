import { API_BASE_URL } from '../config';

/**
 * Prepends the API base URL to a relative image path if necessary.
 * @param path The image path or URL
 * @returns The absolute URL to the image
 */
export const getImageUrl = (path: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // Ensure we don't have double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};
