import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('link', { name: "Don't have an account? Register" }).click();
});

test('registers with valid details and accepted terms', async ({ page }) => {
  const form = page.getByRole('form', { name: 'Registration' });
  await form.getByRole('textbox', { name: 'Username' }).fill('alex');
  await form.getByRole('textbox', { name: 'Email' }).fill('another@example.dev');
  await form.getByLabel('Password').fill('Strong123');
  await form.getByRole('checkbox', { name: 'I agree to the terms of use and privacy' }).check();
  await form.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByRole('heading', { name: 'User Login' })).toBeVisible();
  await expect(page.getByRole('alert')).toHaveText('You are now registered!');
});

test('reports missing fields in form order, then unchecked terms', async ({ page }) => {
  const form = page.getByRole('form', { name: 'Registration' });
  const register = form.getByRole('button', { name: 'Register' });

  await register.click();
  await expect(page.getByRole('alert')).toHaveText('Please enter username to register');

  await form.getByRole('textbox', { name: 'Username' }).fill('case');
  await register.click();
  await expect(page.getByRole('alert')).toHaveText('Please enter email to register');

  await form.getByRole('textbox', { name: 'Email' }).fill('case@example.org');
  await register.click();
  await expect(page.getByRole('alert')).toHaveText('Please enter password to register');

  await form.getByLabel('Password').fill('Password1');
  await register.click();
  await expect(page.getByRole('alert')).toHaveText('You must agree to terms of use and privacy to register');
});

test('enforces username and password length boundaries', async ({ page }) => {
  const form = page.getByRole('form', { name: 'Registration' });
  const register = form.getByRole('button', { name: 'Register' });
  await form.getByRole('textbox', { name: 'Username' }).fill('ninechars');
  await form.getByRole('textbox', { name: 'Email' }).fill('bounds@example.org');
  await form.getByLabel('Password').fill('Password1');
  await form.getByRole('checkbox', { name: 'I agree to the terms of use and privacy' }).check();
  await register.click();
  await expect(page.getByRole('alert')).toHaveText('Username must be 8 characters or fewer.');

  await form.getByRole('textbox', { name: 'Username' }).fill('eightchr');
  await form.getByLabel('Password').fill('1234567');
  await register.click();
  await expect(page.getByRole('alert')).toHaveText('Password must be between 8 and 12 characters.');

  await form.getByLabel('Password').fill('1234567890123');
  await register.click();
  await expect(page.getByRole('alert')).toHaveText('Password must be between 8 and 12 characters.');

  await form.getByLabel('Password').fill('123456789012');
  await register.click();
  await expect(page.getByRole('alert')).toHaveText('You are now registered!');
});

test('rejects an existing email regardless of case', async ({ page }) => {
  const form = page.getByRole('form', { name: 'Registration' });
  await form.getByRole('textbox', { name: 'Username' }).fill('someone');
  await form.getByRole('textbox', { name: 'Email' }).fill('ALEX@EXAMPLE.COM');
  await form.getByLabel('Password').fill('Password1');
  await form.getByRole('checkbox', { name: 'I agree to the terms of use and privacy' }).check();
  await form.getByRole('button', { name: 'Register' }).click();

  await expect(page.getByRole('alert')).toHaveText('An account with this email already exists.');
});
