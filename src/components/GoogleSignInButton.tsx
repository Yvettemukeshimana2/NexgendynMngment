interface GoogleSignInButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export default function GoogleSignInButton({
  onClick,
  disabled = false,
  label = "Continue with Google",
}: GoogleSignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-5 py-3 font-extrabold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
        <path
          fill="#4285F4"
          d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.92h5.38a4.6 4.6 0 0 1-2 3.02v2.54h3.24c1.9-1.75 2.98-4.34 2.98-7.41Z"
        />
        <path
          fill="#34A853"
          d="M12 22c2.7 0 4.97-.9 6.62-2.36l-3.24-2.54c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.62A10 10 0 0 0 12 22Z"
        />
        <path
          fill="#FBBC05"
          d="M6.41 13.94A6 6 0 0 1 6.1 12c0-.67.11-1.32.31-1.94V7.44H3.07A10 10 0 0 0 2 12c0 1.61.38 3.14 1.07 4.56l3.34-2.62Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.94c1.47 0 2.8.51 3.84 1.5l2.88-2.88A9.66 9.66 0 0 0 12 2a10 10 0 0 0-8.93 5.44l3.34 2.62C7.2 7.7 9.4 5.94 12 5.94Z"
        />
      </svg>
      {label}
    </button>
  );
}
