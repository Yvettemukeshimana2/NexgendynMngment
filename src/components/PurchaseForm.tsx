import { useMemo, useState, type FormEvent } from "react";
import { formatMoney } from "../lib/format";
import {
  PAYMENT_METHODS,
  PURCHASE_CATEGORIES,
  type PurchaseDraft,
} from "../types/purchase";
import { usePurchases } from "../context/PurchaseContext";

function createInitialForm(): PurchaseDraft {
  return {
    itemName: "",
    category: "Office Supplies",
    quantity: 20,
    unit: "pieces",
    unitPrice: 1000,
    purchaseDate: new Date().toISOString().slice(0, 10),
    supplier: "",
    paymentMethod: "Cash",
    notes: "",
  };
}

interface PurchaseFormProps {
  onSaved?: (message: string) => void;
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function PurchaseForm({ onSaved }: PurchaseFormProps) {
  const { addPurchase } = usePurchases();
  const [form, setForm] = useState<PurchaseDraft>(() => createInitialForm());
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
      const purchase = addPurchase(form);
      onSaved?.(
        `${purchase.quantity} ${purchase.unit} of ${purchase.itemName} saved. Dashboard updated with ${formatMoney(purchase.total)}.`,
      );
      setForm(createInitialForm());
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "The purchase could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
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
            placeholder="Paper"
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
            onChange={(event) => update("quantity", event.target.valueAsNumber)}
            required
          />
        </label>

        <label className="mb-4 text-sm font-bold text-slate-700">
          Unit
          <input
            className={inputClass}
            value={form.unit}
            onChange={(event) => update("unit", event.target.value)}
            placeholder="pieces, boxes, reams"
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
            onChange={(event) => update("unitPrice", event.target.valueAsNumber)}
            required
          />
        </label>

        <label className="mb-4 text-sm font-bold text-slate-700">
          Purchase date
          <input
            className={inputClass}
            type="date"
            value={form.purchaseDate}
            onChange={(event) => update("purchaseDate", event.target.value)}
            required
          />
        </label>

        <label className="mb-4 text-sm font-bold text-slate-700">
          Supplier
          <input
            className={inputClass}
            value={form.supplier}
            onChange={(event) => update("supplier", event.target.value)}
            placeholder="Office Shop Ltd"
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

      <label className="mb-4 block text-sm font-bold text-slate-700">
        Notes
        <textarea
          className={`${inputClass} min-h-24 resize-y`}
          value={form.notes}
          onChange={(event) => update("notes", event.target.value)}
          placeholder="Optional information"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-brand-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-brand-900 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Purchase"}
        </button>

        <button
          type="button"
          onClick={() => {
            setForm(createInitialForm());
            setError("");
          }}
          className="rounded-xl bg-slate-100 px-5 py-3 text-sm font-extrabold text-slate-700 hover:bg-slate-200"
        >
          Reset
        </button>

        <p className="w-full text-sm font-extrabold text-brand-700 sm:ml-auto sm:w-auto">
          Total: {formatMoney(Number.isFinite(total) ? total : 0)}
        </p>
      </div>
    </form>
  );
}
