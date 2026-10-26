export function resolveImageUrl(path: string, baseUrl: string): string {
  const normalizedPath = path.trim().replace(/^https\/\//i, 'https://');

  if (/^https?:\/\//i.test(normalizedPath)) {
    return normalizedPath;
  }

  return `${baseUrl}${normalizedPath.startsWith('/') ? '' : '/'}${normalizedPath}`;
}
