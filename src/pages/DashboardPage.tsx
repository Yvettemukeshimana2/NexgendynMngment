import { useMemo, useState } from "react";
import PurchaseForm from "../components/PurchaseForm";
import PurchaseTable from "../components/PurchaseTable";
import StatCard from "../components/StatCard";
import { usePurchases } from "../context/PurchaseContext";
import { formatMoney } from "../lib/format";

export default function DashboardPage() {
  const { purchases, storageError } = usePurchases();
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const stats = useMemo(() => {
    const totalSpent = purchases.reduce(
      (sum, purchase) => sum + Number(purchase.total || 0),
      0,
    );
    const totalQuantity = purchases.reduce(
      (sum, purchase) => sum + Number(purchase.quantity || 0),
      0,
    );

    const monthPrefix = new Date().toISOString().slice(0, 7);
    const thisMonth = purchases
      .filter((purchase) => purchase.purchaseDate.startsWith(monthPrefix))
      .reduce((sum, purchase) => sum + Number(purchase.total || 0), 0);

    const categoryTotals = purchases.reduce<Record<string, number>>(
      (totals, purchase) => {
        totals[purchase.category] =
          (totals[purchase.category] ?? 0) + Number(purchase.total || 0);
        return totals;
      },
      {},
    );

    return { totalSpent, totalQuantity, thisMonth, categoryTotals };
  }, [purchases]);

  const categories = Object.entries(stats.categoryTotals).sort(
    (left, right) => right[1] - left[1],
  );
  const largestCategory = categories[0]?.[1] ?? 1;

  return (
    <div className="space-y-5">
      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          {message}
        </div>
      )}

      {storageError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          {storageError}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold">Add an expense</h2>
            <p className="mt-1 text-sm text-slate-500">
              Record a purchase directly from the dashboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-extrabold text-white hover:bg-brand-900"
          >
            {showForm ? "Close form" : "+ Add Purchase"}
          </button>
        </div>

        {showForm && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <PurchaseForm
              onSaved={(savedMessage) => {
                setMessage(savedMessage);
                setShowForm(false);
              }}
            />
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total spent"
          value={formatMoney(stats.totalSpent)}
          note="All recorded purchases"
        />
        <StatCard
          label="Total quantity"
          value={stats.totalQuantity.toLocaleString()}
          note="All purchased units"
        />
        <StatCard
          label="Transactions"
          value={purchases.length.toLocaleString()}
          note="Number of purchase records"
        />
        <StatCard
          label="This month"
          value={formatMoney(stats.thisMonth)}
          note="Current-month spending"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold">Spending by category</h2>
          <div className="mt-6 space-y-5">
            {categories.length === 0 ? (
              <p className="text-sm text-slate-500">No purchases recorded.</p>
            ) : (
              categories.map(([category, amount]) => (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-slate-700">{category}</span>
                    <span className="font-extrabold text-slate-900">
                      {formatMoney(amount)}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500"
                      style={{
                        width: `${Math.max(3, (amount / largestCategory) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold">How it updates</h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-slate-600">
            <p>
              Save 20 pieces of paper at 1,000 RWF each and the dashboard adds
              20 to quantity and 20,000 RWF to spending.
            </p>
            <p>
              The new purchase immediately appears in the table below and in
              the Office Supplies category.
            </p>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="mb-5 text-lg font-extrabold">Recent purchases</h2>
        <PurchaseTable purchases={purchases.slice(0, 5)} />
      </section>
    </div>
  );
}
