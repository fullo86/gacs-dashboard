export function OverviewCard({ label, data }) {
    const displayValue = label === "Avg Uptime" ? `${data.value}%` : data.value;  
    return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">

      <div className="mt-6 flex items-end justify-between">
        <dl>
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            {displayValue}
          </dt>

          <dd className="text-sm font-medium text-dark-6">{label}</dd>
        </dl>
      </div>
    </div>
  );
}
