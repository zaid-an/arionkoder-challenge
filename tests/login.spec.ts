import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('logs in with a seeded account', async ({ page }) => {
  const form = page.getByRole('form', { name: 'Login' });
  await form.getByRole('textbox', { name: 'Email' }).fill('sam@example.org');
  await form.getByLabel('Password').fill('Welcome12');
  await form.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();
  await expect(page.getByText('sam', { exact: true })).toBeVisible();
});

test('rejects invalid credentials', async ({ page }) => {
  const form = page.getByRole('form', { name: 'Login' });
  await form.getByRole('textbox', { name: 'Email' }).fill('alex@example.com');
  await form.getByLabel('Password').fill('WrongPass1');
  await form.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('alert')).toHaveText('Invalid email or password.');
  await expect(page.getByRole('heading', { name: 'User Login' })).toBeVisible();
});

test('logs in with a newly registered account', async ({ page }) => {
  await page.getByRole('link', { name: "Don't have an account? Register" }).click();
  const registration = page.getByRole('form', { name: 'Registration' });
  await registration.getByRole('textbox', { name: 'Username' }).fill('zoe');
  await registration.getByRole('textbox', { name: 'Email' }).fill('zoe@example.io');
  await registration.getByLabel('Password').fill('NewPass12');
  await registration.getByRole('checkbox', { name: 'I agree to the terms of use and privacy' }).check();
  await registration.getByRole('button', { name: 'Register' }).click();

  const login = page.getByRole('form', { name: 'Login' });
  await login.getByRole('textbox', { name: 'Email' }).fill('zoe@example.io');
  await login.getByLabel('Password').fill('NewPass12');
  await login.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('zoe', { exact: true })).toBeVisible();
});

test('logout ends the session', async ({ page }) => {
  const form = page.getByRole('form', { name: 'Login' });
  await form.getByRole('textbox', { name: 'Email' }).fill('alex@example.com');
  await form.getByLabel('Password').fill('Password1');
  await form.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('button', { name: 'Logout' }).click();

  await expect(page.getByRole('heading', { name: 'User Login' })).toBeVisible();
  await page.goto('/#account');
  await expect(page.getByRole('heading', { name: 'User Login' })).toBeVisible();
});
