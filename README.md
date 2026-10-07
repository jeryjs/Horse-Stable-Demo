# Equus - Stable Management

Equus is a small horse-stable management app for maintaining horse profiles and activity records. It includes a dashboard, searchable lists, and local care insights.

## Features

- Add and edit horse profiles, including an optional photo.
- Record, update, and remove activities such as training, feeding, grooming, and veterinary visits.
- Browse each horse's activity timeline and filter or search the horse and activity lists.
- Review stable metrics, today's activities, and care insights on the dashboard.
- Switch between light, dark, and system themes.

Care insights are generated from local rules and activity dates. They are not AI-generated medical advice or a substitute for veterinary care.

## Screenshots

Add screenshots here when available. Replace each placeholder with an image, for example: `![Dashboard](screenshots/dashboard.png)`.

### Sign in

<!-- <Sign-in page screenshot goes here> -->

### Dashboard

<!-- <Dashboard screenshot goes here> -->

### Horses

<!-- <Horse list screenshot goes here> -->

### Horse profile

<!-- <Horse profile and activity timeline screenshot goes here> -->

### Activities

<!-- <Activity list screenshot goes here> -->

### Not found

<!-- <Not-found page screenshot goes here> -->

## Run locally

Requires Node.js and pnpm.

```sh
pnpm install
pnpm dev
```

Other useful commands:

```sh
pnpm build
pnpm lint
pnpm preview
```

## Data and sign-in

Horse and activity records are stored in IndexedDB in the current browser. Sample records are added when the app is first opened. Data does not sync between browsers or devices.

Sign-in is a local demo flow, not server-backed authentication. It accepts a valid email format and a password of at least six characters; it does not verify credentials. Do not use it to protect real or sensitive data.

## Tech stack

React, TypeScript, Vite, React Router, MUI, and IndexedDB.

## Project structure

- `src/pages` — dashboard, horse list, horse profile, activity list, sign-in, and not-found pages.
- `src/components` — shared layout and UI components, including horse and activity forms.
- `src/hooks` — local data, sign-in, theme, notifications, and care insight logic.
- `src/types` — horse and activity data types.
