import { useState } from "react";
import { Calendar, Search, FileText, Download, RotateCw } from "lucide-react";
import { useTranslation } from "@/store/authStore";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterPanelProps {
  onView?: () => void;
  onPdf?: () => void;
  onCsv?: () => void;
  onRefresh?: () => void;
  zones?: FilterOption[];
  bancas?: FilterOption[];
  showDateRange?: boolean;
  showZone?: boolean;
  showBanca?: boolean;
  showSearch?: boolean;
  extraFilters?: React.ReactNode;
}

export default function FilterPanel({
  onView,
  onPdf,
  onCsv,
  onRefresh,
  zones = [],
  bancas = [],
  showDateRange = true,
  showZone = true,
  showBanca = true,
  showSearch = true,
  extraFilters,
}: FilterPanelProps) {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedBanca, setSelectedBanca] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div className="bg-white rounded-xl border border-[#E5E5E0] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] mb-6">
      <div className="flex flex-wrap items-end gap-4">
        {/* Date Range */}
        {showDateRange && (
          <div className="flex flex-wrap items-end gap-3 flex-1 min-w-[280px]">
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                Desde
              </label>
              <div className="relative">
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
              <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">
                Hasta
              </label>
              <div className="relative">
                <Calendar
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {/* Zone Select */}
        {showZone && zones.length > 0 && (
          <div className="flex flex-col gap-1.5 min-w-[160px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">
              Zona
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
            >
              <option value="">Todas las zonas</option>
              {zones.map((z) => (
                <option key={z.value} value={z.value}>
                  {z.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Banca Select */}
        {showBanca && bancas.length > 0 && (
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">
              Banca
            </label>
            <select
              value={selectedBanca}
              onChange={(e) => setSelectedBanca(e.target.value)}
              className="px-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
            >
              <option value="">Todas las bancas</option>
              {bancas.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Search */}
        {showSearch && (
          <div className="flex flex-col gap-1.5 min-w-[200px] flex-1">
            <label className="text-xs font-medium text-[#666666] uppercase tracking-wider">
              {t("common.search")}
            </label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("common.search")}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-[#E5E5E0] rounded-lg bg-white focus:outline-none focus:border-[#4ECDC4] focus:ring-[0_0_0_3px_rgba(78,205,196,0.15)] transition-colors"
              />
            </div>
          </div>
        )}

        {extraFilters}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {onView && (
            <button
              onClick={onView}
              className="px-4 py-2.5 text-sm font-medium text-white bg-[#4ECDC4] rounded-full hover:bg-[#3DBDB5] hover:shadow-[0_2px_8px_rgba(78,205,196,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t("common.view")}
            </button>
          )}
          {onPdf && (
            <button
              onClick={onPdf}
              className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors"
              title="PDF"
            >
              <FileText size={16} />
            </button>
          )}
          {onCsv && (
            <button
              onClick={onCsv}
              className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] transition-colors"
              title="CSV"
            >
              <Download size={16} />
            </button>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2.5 text-sm font-medium text-[#666666] bg-white border border-[#E5E5E0] rounded-full hover:bg-[#F5F5F0] hover:border-[#4ECDC4] hover:rotate-180 transition-all duration-500"
              title={t("common.refresh")}
            >
              <RotateCw size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
