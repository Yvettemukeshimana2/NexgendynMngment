import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const {
    isAuthenticated,
    isLoading,
    isConfigured,
    configurationMessage,
    signUp,
    loginWithGoogle,
  } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-brand-900 text-white">
        <p className="text-lg font-bold">Checking login session…</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    const result = await signUp(fullName, email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setIsGoogleLoading(true);
    const result = await loginWithGoogle();
    setIsGoogleLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/dashboard", { replace: true });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-brand-600">
              Purchase Tracker
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">
              Create your account
            </h1>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-xl font-black text-brand-700">
            PT
          </div>
        </div>

        <p className="text-sm leading-6 text-slate-500">
          Enter a few details or create your account with Google.
        </p>

        {!isConfigured && (
          <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            {configurationMessage}
          </p>
        )}

        <label className="mt-6 block text-sm font-bold text-slate-700">
          Full name
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your full name"
            autoComplete="name"
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </label>

        <label className="mt-4 block text-sm font-bold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-slate-700">
            Password
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              required
            />
          </label>

          <label className="block text-sm font-bold text-slate-700">
            Confirm password
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              minLength={6}
              className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              required
            />
          </label>
        </div>

        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 accent-brand-700"
          />
          Show passwords
        </label>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || isGoogleLoading || !isConfigured}
          className="mt-6 w-full rounded-xl bg-brand-700 px-5 py-3 font-extrabold text-white hover:bg-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </button>

        <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          or
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleSignInButton
          onClick={handleGoogleSignUp}
          disabled={isSubmitting || isGoogleLoading || !isConfigured}
          label={isGoogleLoading ? "Opening Google…" : "Continue with Google"}
        />

        <p className="mt-7 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-extrabold text-brand-700 hover:text-brand-900"
          >
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
