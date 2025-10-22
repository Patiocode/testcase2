// lib/cookies.js - Server-safe cookie functions

export function setCookie(name, value, days) {
  // Only run in browser environment
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/; SameSite=Lax${secureFlag}`;
}

export function getCookie(name) {
  // Only run in browser environment
  if (typeof document === 'undefined') return null;
  
  const cookieName = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return decodeURIComponent(cookie.substring(cookieName.length, cookie.length));
    }
  }
  return null;
}