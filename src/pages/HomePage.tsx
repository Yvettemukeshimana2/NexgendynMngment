import { useState } from "react";
import { Link } from "react-router-dom";
import PurchaseForm from "../components/PurchaseForm";

export default function HomePage() {
  const [message, setMessage] = useState("");

  return (
    <div>
      {message && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <span>{message}</span>
          <Link
            to="/dashboard"
            className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-extrabold text-white hover:bg-emerald-800"
          >
            View Dashboard
          </Link>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-extrabold text-slate-900">
            Record a company purchase
          </h2>
          <p className="mt-2 mb-6 text-sm text-slate-500">
            Enter the item, quantity, price, supplier, and payment information.
          </p>
          <PurchaseForm onSaved={setMessage} />
        </section>

        {/* <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-extrabold text-slate-900">Example</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            When the company buys 20 pieces of paper, enter the following:
          </p>

          <dl className="mt-5 divide-y divide-slate-200 rounded-2xl border border-slate-200">
            <div className="flex justify-between p-4">
              <dt className="font-semibold text-slate-500">Item</dt>
              <dd className="font-bold">Paper</dd>
            </div>
            <div className="flex justify-between p-4">
              <dt className="font-semibold text-slate-500">Quantity</dt>
              <dd className="font-bold">20 pieces</dd>
            </div>
            <div className="flex justify-between p-4">
              <dt className="font-semibold text-slate-500">Unit price</dt>
              <dd className="font-bold">1,000 RWF</dd>
            </div>
            <div className="flex justify-between p-4">
              <dt className="font-semibold text-slate-500">Total</dt>
              <dd className="font-extrabold text-brand-700">20,000 RWF</dd>
            </div>
          </dl>

          <p className="mt-5 rounded-xl bg-brand-50 p-4 text-sm leading-6 text-brand-900">
            After you save it, the dashboard updates the total spent, total
            quantity, transaction count, category chart, and recent purchases.
          </p>
        </aside> */}
      </div>
    </div>
  );
}
