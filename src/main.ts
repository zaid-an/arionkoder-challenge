import './styles.css';
import { authenticate, validateLogin, validateRegistration } from './auth';
import { addUser, clearSession, getSessionUser, setSession } from './storage';

const loginView = document.querySelector<HTMLElement>('#login-view')!;
const signupView = document.querySelector<HTMLElement>('#signup-view')!;
const accountView = document.querySelector<HTMLElement>('#account-view')!;
const accountName = document.querySelector<HTMLElement>('#account-name')!;
const loginMessage = document.querySelector<HTMLElement>('#login-message')!;
const signupMessage = document.querySelector<HTMLElement>('#signup-message')!;
const forgotMessage = document.querySelector<HTMLElement>('#forgot-message')!;

function renderView(): void {
  const user = getSessionUser();
  const showAccount = Boolean(user);
  const showSignup = !showAccount && location.hash === '#signup';

  loginView.hidden = showAccount || showSignup;
  signupView.hidden = showAccount || !showSignup;
  accountView.hidden = !showAccount;
  accountName.textContent = user?.username ?? '';
}

document.querySelector<HTMLFormElement>('#login-form')!.addEventListener('submit', (event) => {
  event.preventDefault();
  loginMessage.classList.remove('success');

  const email = document.querySelector<HTMLInputElement>('#login-email')!.value.trim();
  const password = document.querySelector<HTMLInputElement>('#login-password')!.value.trim();
  const error = validateLogin(email, password);
  if (error) {
    loginMessage.textContent = error;
    return;
  }

  const user = authenticate(email, password);
  if (!user) {
    loginMessage.textContent = 'Invalid email or password.';
    return;
  }

  loginMessage.textContent = '';
  setSession(user);
  location.hash = 'account';
  renderView();
});

document.querySelector<HTMLFormElement>('#signup-form')!.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.querySelector<HTMLInputElement>('#signup-username')!.value.trim();
  const email = document.querySelector<HTMLInputElement>('#signup-email')!.value.trim();
  const password = document.querySelector<HTMLInputElement>('#signup-password')!.value.trim();
  const acceptedTerms = document.querySelector<HTMLInputElement>('#signup-terms')!.checked;
  const error = validateRegistration(username, email, password, acceptedTerms);
  if (error) {
    signupMessage.textContent = error;
    return;
  }

  if (!addUser({ username, email, password })) {
    signupMessage.textContent = 'An account with this email already exists.';
    return;
  }

  document.querySelector<HTMLFormElement>('#signup-form')!.reset();
  signupMessage.textContent = '';
  loginMessage.textContent = 'You are now registered!';
  loginMessage.classList.add('success');
  location.hash = 'login';
  renderView();
});

document.querySelector<HTMLAnchorElement>('#forgot-link')!.addEventListener('click', (event) => {
  event.preventDefault();
  forgotMessage.textContent = 'Planned for Q4 2029. Subject to prioritization.';
});

document.querySelector<HTMLButtonElement>('#logout-button')!.addEventListener('click', () => {
  clearSession();
  loginMessage.textContent = '';
  document.querySelector<HTMLFormElement>('#login-form')!.reset();
  location.hash = 'login';
  renderView();
});

window.addEventListener('hashchange', renderView);
renderView();
