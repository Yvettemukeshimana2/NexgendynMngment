# Company Purchase Tracker — Firebase Complete Authentication

React, TypeScript, Tailwind CSS, Vite, React Router, and Firebase Authentication.

## Authentication features

- Create account with full name, email, password, and password confirmation
- Sign in with email and password
- Continue with Google
- Forgot-password email
- Persistent login session
- Protected purchase dashboard
- Logout

## Purchase features

- Add purchases
- View dashboard totals
- View all purchase records
- Edit and delete purchase records
- Browser localStorage for purchase data

## Run

```bash
npm install
npm run dev
```

Read `FIREBASE_SETUP.md` before testing authentication.

## Main authentication files

```text
src/
├── components/
│   ├── GoogleSignInButton.tsx
│   └── ProtectedRoute.tsx
├── context/
│   └── AuthContext.tsx
├── lib/
│   └── firebase.ts
└── pages/
    ├── LoginPage.tsx
    ├── SignUpPage.tsx
    └── ForgotPasswordPage.tsx
```

## Important

Firebase is used for authentication. Purchase records are still stored in browser localStorage. Use Cloud Firestore later when records must be shared across devices or users.
