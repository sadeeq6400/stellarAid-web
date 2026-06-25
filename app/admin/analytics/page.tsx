
import AdminHeader from "@/components/admin/AdminHeader";
import AssetBreakdownPieChart from "@/components/admin/analytics/AssetBreakdownPieChart";
import ExportData from "@/components/admin/analytics/ExportData";
import KPIs from "@/components/admin/analytics/KPIs";
import TimeSeriesChart from "@/components/admin/analytics/TimeSeriesChart";

const AdminAnalyticsPage = () => {
  return (
    <div>
      <AdminHeader title="Analytics" />
      <div className="p-4">
        <KPIs />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <TimeSeriesChart />
          <AssetBreakdownPieChart />
        </div>
        <div className="mt-4">
          <ExportData />
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;