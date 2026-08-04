import { formatDate, formatMoney } from "../lib/format";
import type { Purchase } from "../types/purchase";

interface PurchaseTableProps {
  purchases: Purchase[];
  onEdit?: (purchase: Purchase) => void;
  onDelete?: (id: string) => void;
}

export default function PurchaseTable({
  purchases,
  onEdit,
  onDelete,
}: PurchaseTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        No purchases found.
      </div>
    );
  }

  const showActions = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-[980px] w-full border-collapse bg-white text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Item</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Quantity</th>
            <th className="px-4 py-3">Unit price</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Supplier</th>
            {showActions && <th className="px-4 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="border-t border-slate-200">
              <td className="px-4 py-3 text-slate-600">
                {formatDate(purchase.purchaseDate)}
              </td>
              <td className="px-4 py-3 font-bold text-slate-900">
                {purchase.itemName}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700">
                  {purchase.category}
                </span>
              </td>
              <td className="px-4 py-3">
                {purchase.quantity} {purchase.unit}
              </td>
              <td className="px-4 py-3">{formatMoney(purchase.unitPrice)}</td>
              <td className="px-4 py-3 font-extrabold">
                {formatMoney(purchase.total)}
              </td>
              <td className="px-4 py-3">{purchase.supplier || "—"}</td>
              {showActions && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        type="button"
                        onClick={() => onEdit(purchase)}
                        className="rounded-lg bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700 hover:bg-brand-100"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(purchase.id)}
                        className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
