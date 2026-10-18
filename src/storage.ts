export type User = {
  username: string;
  email: string;
  password: string;
};

const USERS_KEY = 'simple-auth-users';
const SESSION_KEY = 'simple-auth-session';

const DEMO_USERS: User[] = [
  { username: 'alex', email: 'alex@example.com', password: 'Password1' },
  { username: 'sam', email: 'sam@example.org', password: 'Welcome12' },
  { username: 'jordan', email: 'jordan@example.net', password: 'DemoPass8' },
];

export function getUsers(): User[] {
  const saved = localStorage.getItem(USERS_KEY);
  if (saved !== null) return JSON.parse(saved) as User[];

  localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS));
  return [...DEMO_USERS];
}

export function addUser(user: User): boolean {
  const users = getUsers();
  if (users.some((existing) => existing.email.toLowerCase() === user.email.toLowerCase())) {
    return false;
  }

  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return true;
}

export function setSession(user: User): void {
  localStorage.setItem(SESSION_KEY, user.email);
}

export function getSessionUser(): User | undefined {
  const email = localStorage.getItem(SESSION_KEY);
  return getUsers().find((user) => user.email.toLowerCase() === email?.toLowerCase());
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
