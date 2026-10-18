import { getUsers, type User } from './storage';

function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateLogin(email: string, password: string): string | null {
  if (!email) return 'Please enter email to login';
  if (!validEmail(email)) return 'Please enter a valid email address.';
  if (!password) return 'Please enter password to login';
  return null;
}

export function validateRegistration(
  username: string,
  email: string,
  password: string,
  acceptedTerms: boolean,
): string | null {
  if (!username) return 'Please enter username to register';
  if (username.length > 8) return 'Username must be 8 characters or fewer.';
  if (!email) return 'Please enter email to register';
  if (!validEmail(email)) return 'Please enter a valid email address.';
  if (!password) return 'Please enter password to register';
  if (password.length < 8 || password.length > 12) {
    return 'Password must be between 8 and 12 characters.';
  }
  if (!acceptedTerms) return 'You must agree to terms of use and privacy to register';
  return null;
}

export function authenticate(email: string, password: string): User | undefined {
  return getUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  );
}
