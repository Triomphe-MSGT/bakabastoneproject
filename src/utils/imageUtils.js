export const getImageSrc = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  // Fallback to local server if it's a relative path
  const BASE_URL = 'http://localhost:5000';
  return BASE_URL + imageUrl;
};
