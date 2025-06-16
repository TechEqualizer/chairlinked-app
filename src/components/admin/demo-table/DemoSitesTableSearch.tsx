
import React from "react";

interface DemoSitesTableSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  isLoading: boolean;
}

export const DemoSitesTableSearch: React.FC<DemoSitesTableSearchProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCount,
  onBulkDelete,
  isLoading
}) => (
  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-zinc-100 shadow-none">
    <div className="flex-1 relative">
      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/></svg>
      <input
        placeholder="Search by business name or prospect..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10 py-2 text-base rounded-lg border border-zinc-200 bg-white w-full focus:ring-2 focus:ring-purple-200 outline-none"
        style={{ fontFamily: 'inherit' }}
      />
    </div>
    {selectedCount > 0 && (
      <button
        onClick={onBulkDelete}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-medium transition"
        style={{ minWidth: 'fit-content' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        Delete Selected ({selectedCount})
      </button>
    )}
  </div>
);
