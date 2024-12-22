export function getCookie(cookies: string, name: string): string | null {
  const cookie = cookies
    .split(';')
    .find((cookie) => cookie.trim().startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
}
