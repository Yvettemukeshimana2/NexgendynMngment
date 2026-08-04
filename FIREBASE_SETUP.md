# Firebase Authentication setup

This version supports:

- Email/password sign-up
- Email/password sign-in
- Continue with Google
- Forgot-password email
- Persistent Firebase sessions
- Protected dashboard routes

## 1. Create and configure Firebase

1. Open Firebase Console and create a project.
2. Add a **Web app** to the project.
3. Copy the Firebase web configuration values.
4. Open **Build / Authentication / Sign-in method**.
5. Enable **Email/Password**.
6. Enable **Google** and choose the project support email.
7. Open **Authentication / Settings / Authorized domains** and make sure your development and deployed domains are allowed.

`localhost` is normally available for local development. Add the domain used by your deployed website.

## 2. Add environment values

Copy `.env.example` to `.env.local`.

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```
Then add the values from Firebase Console:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Restart the Vite development server after changing `.env.local`.

## 3. Run the project

```bash
npm install
npm run dev
```

## Routes

- `/login` — email/password and Google sign-in
- `/signup` — name, email, password, confirm password, and Google sign-up
- `/forgot-password` — sends a Firebase password-reset email
- `/dashboard` — protected dashboard

## Password-reset emails

You can customize the sender name, subject, message, and action URL in Firebase Console under **Authentication / Templates / Password reset**.

## Security note

The Firebase web configuration is intended to be used in the browser. Security comes from Firebase Authentication and your database security rules. Never place a Firebase Admin service-account private key in this React project.
