interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  colorClass?: string;
}

export function StatCard({
  label,
  value,
  sublabel,
  colorClass = "text-collie-700",
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${colorClass}`}>{value}</p>
      {sublabel && <p className="mt-1 text-xs text-gray-400">{sublabel}</p>}
    </div>
  );
}
