export function getStaticUrl(path: string) {
  return `${process.env.STATIC_URL || 'http://127.0.0.1:8000'}/${path}`;
}
