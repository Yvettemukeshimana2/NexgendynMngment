import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const {
    isAuthenticated,
    isLoading,
    isConfigured,
    configurationMessage,
    resetPassword,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setSuccess("");
    setIsSubmitting(true);

    const result = await resetPassword(email);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(result.message);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-xl font-black text-brand-700">
          PT
        </div>
        <h1 className="mt-6 text-3xl font-black text-slate-900">
          Reset your password
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Enter the email used for your account. Firebase will send you a secure
          password-reset link.
        </p>

        {!isConfigured && (
          <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-800">
            {configurationMessage}
          </p>
        )}

        <label className="mt-7 block text-sm font-bold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            autoComplete="email"
            autoFocus
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-3 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            required
          />
        </label>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isConfigured}
          className="mt-6 w-full rounded-xl bg-brand-700 px-5 py-3 font-extrabold text-white hover:bg-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Sending email…" : "Send reset link"}
        </button>

        <p className="mt-7 text-center text-sm text-slate-600">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-extrabold text-brand-700 hover:text-brand-900"
          >
            Back to sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
