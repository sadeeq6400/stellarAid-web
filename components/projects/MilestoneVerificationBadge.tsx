import { CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { getStellarExplorerTxUrl } from '@/lib/stellar/explorer';

interface MilestoneVerificationBadgeProps {
  status: 'Released' | 'Unlocked' | 'Locked';
  txHash?: string;
}

export function MilestoneVerificationBadge({ status, txHash }: MilestoneVerificationBadgeProps) {
  if (status === 'Released' && txHash) {
    return (
      <a
        href={getStellarExplorerTxUrl(txHash)}
        target="_blank"
        rel="noopener noreferrer"
        title="Funds released on-chain — click to verify"
        className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200 px-2.5 py-1 text-xs font-semibold text-green-700 hover:bg-green-100 transition-colors"
      >
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
        Verified on-chain
        <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
      </a>
    );
  }

  return (
    <span
      title="Milestone not yet released"
      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-500"
    >
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      Pending
    </span>
  );
}
