'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Confetti } from '@/components/Confetti';
import { CampaignSuccessDetails } from '@/components/campaigns/CampaignSuccessDetails';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/types/api';
import { projectsApi } from '@/lib/api/projects';

interface CampaignSuccessPageProps {
  params: { id: string };
}

export default function CampaignSuccessPage({ params }: CampaignSuccessPageProps) {
  const [campaign, setCampaign] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        setIsLoading(true);
        const response = await projectsApi.getProjectById(params.id);
        setCampaign(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to load campaign:', err);
        setError('Failed to load campaign details. Please try again.');
        setCampaign(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadCampaign();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Confetti />
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="space-y-8 animate-pulse">
            <div className="h-12 w-48 bg-muted rounded" />
            <div className="h-64 w-full bg-muted rounded" />
            <div className="h-32 w-full bg-muted rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !campaign) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground">{error || 'Campaign not found'}</p>
          <Link href="/">
            <Button variant="primary">
              Return Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Confetti />

      {/* Header */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-b border-green-200">
        <div className="container mx-auto max-w-2xl px-4 py-12">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-600">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                Campaign Deployed Successfully!
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Your campaign &ldquo;{campaign.title}&rdquo; is now live and ready to receive support.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <CampaignSuccessDetails campaign={campaign} />
      </div>

      {/* Footer CTA */}
      <div className="bg-muted/50 border-t">
        <div className="container mx-auto max-w-2xl px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Need help? Check our <Link href="/faq" className="text-primary hover:underline">FAQ</Link> or <Link href="/contact" className="text-primary hover:underline">contact support</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
