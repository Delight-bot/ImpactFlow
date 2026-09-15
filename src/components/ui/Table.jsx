export default function Table({ columns, rows, emptyLabel = "Nothing to show yet." }) {
  if (rows.length === 0) {
    return <p className="px-5 py-10 text-center text-sm text-slate-400">{emptyLabel}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-medium uppercase tracking-wide text-slate-400">
            {columns.map((col) => (
              <th key={col.key} scope="col" className="px-5 py-3 whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.id} className="transition-colors hover:bg-slate-50">
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3.5 align-middle text-slate-600">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
