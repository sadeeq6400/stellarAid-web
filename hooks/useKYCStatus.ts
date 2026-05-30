import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import type { KYCStatus } from "@/components/TrustBadge";

interface KYCStatusResponse {
  userId: string;
  status: KYCStatus;
}

export function useKYCStatus(userId: string | undefined) {
  const [status, setStatus] = useState<KYCStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    setIsLoading(true);

    apiClient
      .get<{ data: KYCStatusResponse }>(`/users/${userId}/kyc-status`)
      .then((res) => {
        if (!cancelled) setStatus(res.data.data.status);
      })
      .catch(() => {
        if (!cancelled) setStatus("unverified");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { status, isLoading };
}
