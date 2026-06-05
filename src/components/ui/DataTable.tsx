import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, SearchX } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => string | number;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  width?: string;
  formatter?: (value: string | number, row: T) => string;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  pageSize?: number;
  pageSizeOptions?: number[];
  summaryRow?: React.ReactNode;
  emptyMessage?: string;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  summaryRow,
  emptyMessage = "No hay entradas disponibles",
  isLoading = false,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Reset page when data changes
  useMemo(() => setPage(1), [data.length]);

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !col.sortable) return data;
    return [...data].sort((a, b) => {
      const av = col.accessor(a);
      const bv = col.accessor(b);
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return sortDir === "asc"
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [data, sortKey, sortDir, columns]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  function toggleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // Skeleton loader
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-12 rounded-lg"
              style={{
                background: i % 2 === 0 ? "#FAFAF8" : "#FFFFFF",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-[#E8E8E3]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8F8F5] text-[#666666] text-[13px] font-semibold uppercase tracking-[0.03em]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-${col.align ?? "left"} border-b border-[#E8E8E3] whitespace-nowrap ${
                    col.sortable ? "cursor-pointer select-none hover:text-[#333333]" : ""
                  }`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <div className={`flex items-center gap-1 ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start"}`}>
                    {col.header}
                    {col.sortable && sortKey === col.key && (
                      sortDir === "asc" ? <ChevronUp size={14} className="text-[#4ECDC4]" /> : <ChevronDown size={14} className="text-[#4ECDC4]" />
                    )}
                    {col.sortable && sortKey !== col.key && (
                      <ChevronDown size={14} className="text-[#CCCCCC] opacity-0 group-hover:opacity-100" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-[#999999]"
                >
                  <div className="flex flex-col items-center gap-3">
                    <SearchX size={40} className="text-[#CCCCCC]" />
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`transition-colors border-b border-[#E8E8E3] ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]"
                  } hover:bg-[#F0F8F7] ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((col) => {
                    const rawValue = col.accessor(row);
                    const displayValue = col.formatter
                      ? col.formatter(rawValue, row)
                      : String(rawValue);
                    return (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-${col.align ?? "left"} whitespace-nowrap text-[#333333]`}
                      >
                        {col.cell ? col.cell(row) : displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
          {summaryRow && paginatedData.length > 0 && (
            <tfoot className="bg-[#F8F8F5] font-semibold text-[#333333] border-t-2 border-[#E8E8E3]">
              {summaryRow}
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      {sortedData.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-1">
          {/* Page size */}
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <span>Entradas por pagina:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border border-[#E5E5E0] rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)]"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <span className="text-[#999999] ml-2">
              {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, sortedData.length)} de{" "}
              {sortedData.length}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-[#666666] hover:bg-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg text-[#666666] hover:bg-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      pageNum === currentPage
                        ? "bg-[#4ECDC4] text-white"
                        : "text-[#666666] hover:bg-[#F5F5F0] hover:text-[#333333]"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-[#666666] hover:bg-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg text-[#666666] hover:bg-[#F5F5F0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
