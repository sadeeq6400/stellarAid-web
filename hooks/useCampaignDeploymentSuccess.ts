import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from '@/utils/toast';

interface CampaignDeploymentOptions {
  campaignId: string;
  campaignTitle?: string;
  contractAddress?: string;
  autoRedirect?: boolean;
  delay?: number;
}

/**
 * Hook for handling campaign deployment success flow
 * Provides utilities to redirect to success page and show notifications
 * 
 * Usage:
 * ```
 * const { redirectToSuccess, showSuccessMessage } = useCampaignDeploymentSuccess();
 * 
 * // After successful deployment
 * await redirectToSuccess({
 *   campaignId: newCampaign.id,
 *   campaignTitle: newCampaign.title,
 *   contractAddress: contractId,
 * });
 * ```
 */
export function useCampaignDeploymentSuccess() {
  const router = useRouter();

  const redirectToSuccess = useCallback(
    async (options: CampaignDeploymentOptions) => {
      const {
        campaignId,
        campaignTitle,
        contractAddress,
        autoRedirect = true,
        delay = 500,
      } = options;

      try {
        // Show success toast
        if (campaignTitle) {
          toast.success(`Campaign "${campaignTitle}" deployed successfully!`);
        } else {
          toast.success('Campaign deployed successfully!');
        }

        // Store deployment info in sessionStorage for reference
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            `campaign_deployment_${campaignId}`,
            JSON.stringify({
              campaignId,
              campaignTitle,
              contractAddress,
              timestamp: new Date().toISOString(),
            })
          );
        }

        // Redirect to success page after delay
        if (autoRedirect) {
          setTimeout(() => {
            router.push(`/campaigns/${campaignId}/success`);
          }, delay);
        }
      } catch (error) {
        console.error('Failed to handle deployment success:', error);
        toast.error('Error handling deployment success');
      }
    },
    [router]
  );

  const showSuccessMessage = useCallback(
    (title: string, message: string) => {
      toast.success(`${title}: ${message}`);
    },
    []
  );

  const getDeploymentInfo = useCallback((campaignId: string) => {
    if (typeof window === 'undefined') return null;
    
    const stored = sessionStorage.getItem(`campaign_deployment_${campaignId}`);
    return stored ? JSON.parse(stored) : null;
  }, []);

  return {
    redirectToSuccess,
    showSuccessMessage,
    getDeploymentInfo,
  };
}
