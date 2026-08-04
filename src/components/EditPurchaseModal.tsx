import { useEffect, useMemo, useState, type FormEvent } from "react";
import { usePurchases } from "../context/PurchaseContext";
import { formatMoney } from "../lib/format";
import {
  PAYMENT_METHODS,
  PURCHASE_CATEGORIES,
  type Purchase,
  type PurchaseDraft,
} from "../types/purchase";

interface EditPurchaseModalProps {
  purchase: Purchase;
  onClose: () => void;
  onUpdated: (message: string) => void;
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

function purchaseToDraft(purchase: Purchase): PurchaseDraft {
  return {
    itemName: purchase.itemName,
    category: purchase.category,
    quantity: purchase.quantity,
    unit: purchase.unit,
    unitPrice: purchase.unitPrice,
    purchaseDate: purchase.purchaseDate,
    supplier: purchase.supplier,
    paymentMethod: purchase.paymentMethod,
    notes: purchase.notes,
  };
}

export default function EditPurchaseModal({
  purchase,
  onClose,
  onUpdated,
}: EditPurchaseModalProps) {
  const { updatePurchase } = usePurchases();
  const [form, setForm] = useState<PurchaseDraft>(() =>
    purchaseToDraft(purchase),
  );
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(purchaseToDraft(purchase));
    setError("");
  }, [purchase]);

  const total = useMemo(
    () => Number(form.quantity || 0) * Number(form.unitPrice || 0),
    [form.quantity, form.unitPrice],
  );

  const update = <K extends keyof PurchaseDraft>(
    key: K,
    value: PurchaseDraft[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      const updated = updatePurchase(purchase.id, form);
      onUpdated(
        `${updated.itemName} was updated. New total: ${formatMoney(updated.total)}.`,
      );
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The purchase could not be updated.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-purchase-title"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <div className="my-6 w-full max-w-3xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-7">
          <div>
            <h2
              id="edit-purchase-title"
              className="text-2xl font-black text-slate-900"
            >
              Edit purchase
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Change the product information and save the updated record.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-black text-slate-600 hover:bg-slate-200"
            aria-label="Close edit form"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          {error && (
            <p className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <div className="grid gap-x-5 md:grid-cols-2">
            <label className="mb-4 text-sm font-bold text-slate-700">
              Item name
              <input
                className={inputClass}
                value={form.itemName}
                onChange={(event) => update("itemName", event.target.value)}
                required
              />
            </label>

            <label className="mb-4 text-sm font-bold text-slate-700">
              Category
              <select
                className={inputClass}
                value={form.category}
                onChange={(event) =>
                  update(
                    "category",
                    event.target.value as PurchaseDraft["category"],
                  )
                }
              >
                {PURCHASE_CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="mb-4 text-sm font-bold text-slate-700">
              Quantity
              <input
                className={inputClass}
                type="number"
                min="0.01"
                step="0.01"
                value={form.quantity}
                onChange={(event) =>
                  update("quantity", event.target.valueAsNumber)
                }
                required
              />
            </label>

            <label className="mb-4 text-sm font-bold text-slate-700">
              Unit
              <input
                className={inputClass}
                value={form.unit}
                onChange={(event) => update("unit", event.target.value)}
                required
              />
            </label>

            <label className="mb-4 text-sm font-bold text-slate-700">
              Unit price (RWF)
              <input
                className={inputClass}
                type="number"
                min="0"
                step="1"
                value={form.unitPrice}
                onChange={(event) =>
                  update("unitPrice", event.target.valueAsNumber)
                }
                required
              />
            </label>

            <label className="mb-4 text-sm font-bold text-slate-700">
              Purchase date
              <input
                className={inputClass}
                type="date"
                value={form.purchaseDate}
                onChange={(event) =>
                  update("purchaseDate", event.target.value)
                }
                required
              />
            </label>

            <label className="mb-4 text-sm font-bold text-slate-700">
              Supplier
              <input
                className={inputClass}
                value={form.supplier}
                onChange={(event) => update("supplier", event.target.value)}
              />
            </label>

            <label className="mb-4 text-sm font-bold text-slate-700">
              Payment method
              <select
                className={inputClass}
                value={form.paymentMethod}
                onChange={(event) =>
                  update(
                    "paymentMethod",
                    event.target.value as PurchaseDraft["paymentMethod"],
                  )
                }
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method}>{method}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mb-5 block text-sm font-bold text-slate-700">
            Notes
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
          </label>

          <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-brand-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Updating..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-200"
            >
              Cancel
            </button>
            <p className="w-full text-sm font-extrabold text-brand-700 sm:ml-auto sm:w-auto">
              Updated total: {formatMoney(Number.isFinite(total) ? total : 0)}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
