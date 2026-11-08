import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Inbox,
} from 'lucide-react';
import { SearchBar } from './SearchBar';
import { Skeleton } from './Loader';

export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  isLoading = false,
  searchable = true,
  searchPlaceholder = 'Cari dalam tabel...',
  selectable = false,
  selectedRows = [],
  onSelectRows,
  pagination = true,
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  emptyMessage = 'Tidak ada data untuk ditampilkan.',
  actions,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    return data.filter((row) =>
      columns.some((col) => {
        const val = row[col.key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (typeof aVal === 'string') {
        const comp = aVal.localeCompare(bVal);
        return sortConfig.direction === 'asc' ? comp : -comp;
      }

      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage, pagination]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;

  // Sorting Handler
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      key = null;
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  // Selection Handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = sortedData.map((row) => row[keyField]);
      onSelectRows && onSelectRows(allIds);
    } else {
      onSelectRows && onSelectRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      onSelectRows && onSelectRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      onSelectRows && onSelectRows([...selectedRows, id]);
    }
  };

  const isAllSelected =
    sortedData.length > 0 &&
    sortedData.every((row) => selectedRows.includes(row[keyField]));

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden ${className}`}>
      {/* Table Toolbar */}
      {(searchable || actions) && (
        <div className="p-3.5 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
          {searchable ? (
            <div className="w-full sm:max-w-xs">
              <SearchBar
                placeholder={searchPlaceholder}
                onChange={(val) => {
                  setSearchTerm(val);
                  setCurrentPage(1);
                }}
              />
            </div>
          ) : (
            <div />
          )}

          {actions && (
            <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Table Container with @container query support & keyboard scroll accessibility */}
      <div
        tabIndex={0}
        role="region"
        aria-label={searchPlaceholder || 'Tabel Data'}
        className="responsive-table-wrapper overflow-x-auto min-h-[180px] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
      >
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs">
            <tr className="border-b border-slate-200/80 text-slate-600 font-semibold select-none">
              {selectable && (
                <th className="w-12 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    aria-label="Pilih semua baris"
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3.5 text-slate-700 tracking-wider text-xs uppercase font-semibold whitespace-nowrap ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.sortable ? 'cursor-pointer hover:bg-slate-100/70 transition-colors' : ''}`}
                >
                  <div
                    className={`inline-flex items-center gap-1.5 ${
                      col.align === 'right'
                        ? 'justify-end w-full'
                        : col.align === 'center'
                        ? 'justify-center w-full'
                        : ''
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {isLoading ? (
              // Loading Skeleton Rows
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  {selectable && (
                    <td className="px-4 py-4 text-center">
                      <Skeleton className="w-4 h-4 mx-auto" />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key}
                      data-is-primary={colIdx === 0 ? 'true' : undefined}
                      data-is-actions={col.key === 'actions' ? 'true' : undefined}
                      style={{ '--col-label': `"${col.header}"` }}
                      className="px-4 py-4"
                    >
                      <Skeleton className="w-3/4 h-4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              // Empty State
              <tr data-empty-row="true">
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <Inbox className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">{emptyMessage}</p>
                    {searchTerm && (
                      <p className="text-xs text-slate-400">
                        Tidak ada hasil yang cocok dengan "{searchTerm}"
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              paginatedData.map((row, index) => {
                const isSelected = selectedRows.includes(row[keyField]);

                return (
                  <tr
                    key={row[keyField] || index}
                    className={`transition-colors hover:bg-slate-50/70 ${
                      isSelected ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    {selectable && (
                      <td className="w-12 px-4 py-3.5 text-center" data-is-select="true">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row[keyField])}
                          aria-label={`Pilih baris ${index + 1}`}
                          className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                    )}

                    {columns.map((col, colIdx) => {
                      const isPrimary = colIdx === 0;
                      const isActions = col.key === 'actions';

                      return (
                        <td
                          key={col.key}
                          data-label={col.header}
                          data-is-primary={isPrimary ? 'true' : undefined}
                          data-is-actions={isActions ? 'true' : undefined}
                          style={{ '--col-label': `"${col.header}"` }}
                          className={`px-4 py-3.5 ${
                            col.align === 'right'
                              ? 'text-right'
                              : col.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          }`}
                        >
                          <div className="responsive-td-content min-w-0">
                            {col.render ? col.render(row[col.key], row, index) : row[col.key]}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && !isLoading && sortedData.length > 0 && (
        <div className="px-3.5 sm:px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/40">
          <div className="flex flex-wrap items-center justify-between sm:justify-start w-full sm:w-auto gap-2">
            <div className="flex items-center gap-2">
              <span>Baris:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                aria-label="Jumlah baris per halaman"
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {rowsPerPageOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[11px] sm:text-xs">
              Menampilkan{' '}
              <strong className="text-slate-700">
                {(currentPage - 1) * rowsPerPage + 1}-
                {Math.min(currentPage * rowsPerPage, sortedData.length)}
              </strong>{' '}
              dari <strong className="text-slate-700">{sortedData.length}</strong> data
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              aria-label="Halaman sebelumnya"
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>

            <span className="px-3 py-1 font-medium text-slate-700">
              Hal {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              aria-label="Halaman berikutnya"
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
