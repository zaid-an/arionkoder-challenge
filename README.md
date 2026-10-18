# Simple sign in and sign up

A small frontend-only demo built with vanilla HTML, CSS, TypeScript, and Vite. Playwright runs the browser tests.

## Prerequisites

- Node.js 22 and npm
- Chromium for Playwright (installed with the command below)

## Run locally

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open the URL printed by Vite. To check the production build, run `npm run build`.

## Demo accounts

| Username | Email | Password |
| --- | --- | --- |
| alex | alex@example.com | Password1 |
| sam | sam@example.org | Welcome12 |
| jordan | jordan@example.net | DemoPass8 |

The accounts are seeded into `localStorage` on first load. Registration adds accounts there, using email as the case-insensitive unique identifier. Usernames can repeat. The current session is also stored in `localStorage`. To reset everything manually, clear this site's browser storage and reload.

**This is a demonstration only, not secure production authentication.** Passwords are stored in plain text in the browser; there is no server, database, or real access control.

## Tests and reports

```sh
npm test
npm run report:playwright
```

Keep `npm run dev` running in one terminal and run `npm test` in another. Playwright reuses that server locally and starts its own server in CI. It runs eight independent Chromium tests. Each test clears `localStorage` and reloads the app before interacting with it. The tests cover seeded login, invalid credentials, registration, missing fields and terms, username and password boundaries, duplicate emails, login after registration, and logout.

Playwright writes an HTML report to `playwright-report/`. The Allure reporter writes raw results to `allure-results/`; if you have the Allure CLI installed, run `allure serve allure-results` to view them. GitHub Actions runs the build and tests on pushes and pull requests to `main`, then uploads both report directories as artifacts even if tests fail.

The forgot-password link is an interactive placeholder. It displays the planned-release message on hover and click; password recovery is outside this demo.
