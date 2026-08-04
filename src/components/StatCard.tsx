interface StatCardProps {
  label: string;
  value: string;
  note: string;
}

export default function StatCard({ label, value, note }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-2 text-xs font-semibold text-emerald-700">{note}</p>
    </article>
  );
}
