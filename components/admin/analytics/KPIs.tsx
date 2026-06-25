
import StatCard from "@/components/ui/StatCard";

const KPIs = () => {
  // Mock data for KPIs
  const kpiData = {
    dau: 1200,
    newCampaigns: 25,
    totalVolume: 50000,
    contractDeployments: 10,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Daily Active Users" value={kpiData.dau.toString()} />
      <StatCard title="New Campaigns" value={kpiData.newCampaigns.toString()} />
      <StatCard title="Total Volume (USD)" value={`$${kpiData.totalVolume.toLocaleString()}`} />
      <StatCard title="Contract Deployments" value={kpiData.contractDeployments.toString()} />
    </div>
  );
};

export default KPIs;