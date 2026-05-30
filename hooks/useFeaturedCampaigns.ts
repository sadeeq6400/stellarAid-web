import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Project } from "@/types/api";

interface FeaturedCampaignsResponse {
  data: Project[];
}

async function fetchFeaturedCampaigns(): Promise<Project[]> {
  const response = await apiClient.get<FeaturedCampaignsResponse>(
    "/projects?featured=true&limit=6"
  );
  return response.data.data;
}

export function useFeaturedCampaigns() {
  return useQuery({
    queryKey: ["campaigns", "featured"],
    queryFn: fetchFeaturedCampaigns,
    staleTime: 5 * 60 * 1000,
  });
}
