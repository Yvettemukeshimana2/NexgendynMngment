import { useMemo, useState } from "react";
import EditPurchaseModal from "../components/EditPurchaseModal";
import PurchaseTable from "../components/PurchaseTable";
import { usePurchases } from "../context/PurchaseContext";
import type { Purchase } from "../types/purchase";

function escapeCsv(value: string | number): string {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export default function PurchasesPage() {
  const { purchases, deletePurchase, storageError } = usePurchases();
  const [search, setSearch] = useState("");
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return purchases;

    return purchases.filter((purchase) =>
      [
        purchase.itemName,
        purchase.category,
        purchase.supplier,
        purchase.paymentMethod,
        purchase.notes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [purchases, search]);

  const exportCsv = () => {
    const header = [
      "Date",
      "Item",
      "Category",
      "Quantity",
      "Unit",
      "Unit Price",
      "Total",
      "Supplier",
      "Payment Method",
      "Notes",
    ];

    const rows = purchases.map((purchase) => [
      purchase.purchaseDate,
      purchase.itemName,
      purchase.category,
      purchase.quantity,
      purchase.unit,
      purchase.unitPrice,
      purchase.total,
      purchase.supplier,
      purchase.paymentMethod,
      purchase.notes,
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "company-purchases.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this purchase record?")) {
      deletePurchase(id);
      setMessage("Purchase record deleted.");
    }
  };

  return (
    <div className="space-y-5">
      {message && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
          <span>{message}</span>
          <button
            type="button"
            onClick={() => setMessage("")}
            className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-extrabold hover:bg-emerald-200"
          >
            Dismiss
          </button>
        </div>
      )}

      {storageError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          {storageError}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold">Purchase records</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, edit, export, or delete purchase entries.
            </p>
          </div>

          <div className="flex w-full flex-wrap gap-3 sm:w-auto">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search item, category, supplier..."
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100 sm:w-72"
            />
            <button
              type="button"
              onClick={exportCsv}
              className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-extrabold text-slate-700 hover:bg-slate-200"
            >
              Export CSV
            </button>
          </div>
        </div>

        <PurchaseTable
          purchases={filtered}
          onEdit={setEditingPurchase}
          onDelete={handleDelete}
        />
      </section>

      {editingPurchase && (
        <EditPurchaseModal
          purchase={editingPurchase}
          onClose={() => setEditingPurchase(null)}
          onUpdated={setMessage}
        />
      )}
    </div>
  );
}
