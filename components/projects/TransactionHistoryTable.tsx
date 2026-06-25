'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export interface OnChainTransaction {
  id: string;
  type: 'Donation' | 'Release';
  walletAddress: string;
  amount: string;
  asset: string;
  timestamp: string;
  txHash: string;
}

interface TransactionHistoryTableProps {
  transactions: OnChainTransaction[];
  network?: 'testnet' | 'public';
}

const PAGE_SIZE = 20;

export function TransactionHistoryTable({
  transactions,
  network = 'testnet',
}: TransactionHistoryTableProps) {
  const [typeFilter, setTypeFilter] = useState<'' | 'Donation' | 'Release'>('');
  const [page, setPage] = useState(1);

  const explorerBase =
    network === 'public'
      ? 'https://stellar.expert/explorer/public'
      : 'https://stellar.expert/explorer/testnet';

  const filtered = typeFilter ? transactions.filter((tx) => tx.type === typeFilter) : transactions;
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <label htmlFor="tx-type-filter" className="text-sm font-medium text-neutral-600">
          Filter by type:
        </label>
        <select
          id="tx-type-filter"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value as '' | 'Donation' | 'Release'); setPage(1); }}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="">All</option>
          <option value="Donation">Donation</option>
          <option value="Release">Release</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="min-w-full divide-y divide-neutral-200 text-sm text-neutral-700">
          <thead className="bg-neutral-50">
            <tr>
              {['Type', 'Wallet', 'Amount', 'Asset', 'Timestamp', 'Tx Hash'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              paginated.map((tx) => (
                <tr key={tx.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      tx.type === 'Donation'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-green-50 text-green-700'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs" title={tx.walletAddress}>
                    {tx.walletAddress.slice(0, 8)}…{tx.walletAddress.slice(-6)}
                  </td>
                  <td className="px-4 py-3 font-semibold">{tx.amount}</td>
                  <td className="px-4 py-3">{tx.asset}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`${explorerBase}/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 font-semibold"
                      aria-label={`View transaction ${tx.txHash} on Stellar Expert`}
                    >
                      {tx.txHash.slice(0, 8)}…
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center text-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-neutral-500">
            Page {page} of {totalPages} ({filtered.length} transactions)
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
