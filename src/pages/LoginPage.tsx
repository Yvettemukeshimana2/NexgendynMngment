 import { useState, type FormEvent } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";
import logo from "../asset/Nexgen (2).png";
export default function LoginPage() {
  const {
    isAuthenticated,
    isLoading,
    isConfigured,
    configurationMessage,
    login,
    loginWithGoogle,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const targetRoute =
    (location.state as { from?: string } | null)?.from ?? "/dashboard";

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-brand-900 text-white">
        <p className="text-lg font-bold">Checking login session…</p>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={targetRoute} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate(targetRoute, { replace: true });
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const result = await loginWithGoogle();

      if (!result.success) {
        setError(result.message);
        return;
      }

      navigate(targetRoute, { replace: true });
    } catch {
      setError("Unable to sign in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-brand-900 lg:grid-cols-[1.15fr_0.85fr]">
      <section className="hidden items-center px-16 text-white lg:flex">
        <div className="max-w-2xl">
          <p className="mb-5 text-sm font-extrabold uppercase tracking-[0.25em] text-brand-100">
            Nexgen DYN purchase system
          </p>

          <h1 className="text-6xl font-black leading-tight">
            Nexgen DYN Expenses.
          </h1>
        </div>
      </section>

      <section className="grid place-items-center bg-white/5 p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        >
          <img
            src={logo}
            alt="Nexgen DYN logo"
            className="mb-7 h-16 w-auto max-w-[190px] object-contain"
          />

          <h2 className="text-3xl font-black text-slate-900">
            Welcome back
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to open your dashboard.
          </p>

          {!isConfigured && (
            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
              {configurationMessage} Copy{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5">
                .env.example
              </code>{" "}
              to{" "}
              <code className="rounded bg-amber-100 px-1 py-0.5">
                .env.local
              </code>
              .
            </p>
          )}

          <label
            htmlFor="email"
            className="mt-7 block text-sm font-bold text-slate-700"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            autoFocus
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />

          <label
            htmlFor="password"
            className="mt-4 block text-sm font-bold text-slate-700"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
          />

          <div className="mt-3 flex items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(event) =>
                  setShowPassword(event.target.checked)
                }
                className="h-4 w-4 rounded border-slate-300 accent-brand-700"
              />

              <span>Show password</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm font-extrabold text-brand-700 transition hover:text-brand-900"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting || isGoogleLoading || !isConfigured
            }
            className="mt-6 w-full rounded-xl bg-brand-700 px-5 py-3 font-extrabold text-white transition hover:bg-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>

          <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            <span>or</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <GoogleSignInButton
            onClick={handleGoogleLogin}
            disabled={
              isSubmitting || isGoogleLoading || !isConfigured
            }
            label={
              isGoogleLoading
                ? "Opening Google…"
                : "Continue with Google"
            }
          />

          <p className="mt-7 text-center text-sm text-slate-600">
            Do not have an account?{" "}
            <Link
              to="/signup"
              className="font-extrabold text-brand-700 transition hover:text-brand-900"
            >
              Create account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}