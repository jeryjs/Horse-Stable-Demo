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

<img width="360" alt="Login" src="https://github.com/user-attachments/assets/7066ebb0-81ac-4378-947b-4880d092aa58" />
<img width="360" alt="Horses" src="https://github.com/user-attachments/assets/e44d4bc5-03c2-4a07-8471-974f9529af40" />
<img width="360" alt="Horses Profile" src="https://github.com/user-attachments/assets/f8a94ebb-2249-4495-85cf-44776d97ebe8" />
<img width="360" alt="Activities" src="https://github.com/user-attachments/assets/46dc5ff0-c6ce-457c-b492-d7a187af5aec" />
<img width="360" alt="Dashboard" src="https://github.com/user-attachments/assets/8867f62c-0b7e-40bd-9ae9-0586f39c716e" />

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
