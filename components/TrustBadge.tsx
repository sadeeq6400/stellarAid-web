"use client";

import { useState } from "react";
import { BadgeCheck, ShieldAlert } from "lucide-react";
import { clsx } from "clsx";

export type KYCStatus = "verified" | "unverified" | "pending";

interface TrustBadgeProps {
  status: KYCStatus;
  size?: "sm" | "md";
  className?: string;
}

const TOOLTIP_TEXT: Record<KYCStatus, string> = {
  verified:
    "This creator has completed identity verification (KYC). Your donation goes to a legitimate, verified cause.",
  unverified:
    "This creator has not completed identity verification. Donate with caution.",
  pending:
    "Identity verification is in progress for this creator.",
};

export function TrustBadge({ status, size = "md", className }: TrustBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const isVerified = status === "verified";
  const isPending = status === "pending";

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const textSize = size === "sm" ? "text-[9px]" : "text-[10px]";
  const padding = size === "sm" ? "px-2 py-1" : "px-3 py-1.5";

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
    >
      <div
        className={clsx(
          "flex items-center gap-1.5 rounded-full shadow-sm cursor-default select-none",
          padding,
          isVerified
            ? "bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700"
            : isPending
            ? "bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700"
            : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700",
          className
        )}
        role="img"
        aria-label={`Creator is ${status}`}
        tabIndex={0}
      >
        {isVerified ? (
          <BadgeCheck
            className={clsx(iconSize, "text-emerald-600 dark:text-emerald-400")}
          />
        ) : (
          <ShieldAlert
            className={clsx(
              iconSize,
              isPending
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-slate-400 dark:text-slate-500"
            )}
          />
        )}
        <span
          className={clsx(
            "font-bold uppercase tracking-wider",
            textSize,
            isVerified
              ? "text-emerald-700 dark:text-emerald-300"
              : isPending
              ? "text-yellow-700 dark:text-yellow-300"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          {isVerified ? "Verified" : isPending ? "Pending" : "Unverified"}
        </span>
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-56 pointer-events-none">
          <div className="bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border p-2.5 text-center leading-relaxed">
            {TOOLTIP_TEXT[status]}
          </div>
          <div className="w-2 h-2 bg-popover border-r border-b border-border rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </div>
  );
}
