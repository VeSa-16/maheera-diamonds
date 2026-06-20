export const getUnsplashSrcSet = (url: string) => {
  if (!url.includes('unsplash.com')) return undefined;
  const baseUrl = url.split('?')[0];
  return `${baseUrl}?auto=format&fit=crop&q=80&w=400 400w, ${baseUrl}?auto=format&fit=crop&q=80&w=800 800w, ${baseUrl}?auto=format&fit=crop&q=80&w=1200 1200w`;
};
