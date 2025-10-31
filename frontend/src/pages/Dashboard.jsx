import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, TrendingDown, Activity } from 'lucide-react';
import StatCard from '../components/StatCard';
import StockBadge from '../components/StockBadge';
import { apiCall } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await apiCall('/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">Monitor your EMS inventory at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Supplies"
          value={stats?.inventory?.total_supplies || 0}
          subtitle="Items tracked"
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Critical Low"
          value={stats?.inventory?.critical_low || 0}
          subtitle="Needs immediate restock"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Low Stock"
          value={stats?.inventory?.low_stock || 0}
          subtitle="Restock soon"
          icon={TrendingDown}
          color="yellow"
        />
        <StatCard
          title="Recent Activity"
          value={stats?.recent_transactions_count || 0}
          subtitle="Last 7 days"
          icon={Activity}
          color="green"
        />
      </div>

      {/* Critical Supplies Alert */}
      {stats?.critical_supplies?.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Critical Supplies - Immediate Attention Required
            </h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supply Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min Threshold
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.critical_supplies.map((supply) => (
                    <tr key={supply.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {supply.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {supply.category_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {supply.current_quantity} {supply.unit}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {supply.min_threshold} {supply.unit}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                            <div
                              className={`h-2 rounded-full ${
                                supply.stock_percentage <= 100 ? 'bg-red-600' : 'bg-yellow-600'
                              }`}
                              style={{ width: `${Math.min(supply.stock_percentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium text-gray-600">
                            {supply.stock_percentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.recent_activity?.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`p-2 rounded-full ${
                    activity.quantity_change < 0 ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <Activity className={`h-4 w-4 ${
                      activity.quantity_change < 0 ? 'text-red-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.supply_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {activity.employee_name} - {activity.reason}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className={`text-sm font-medium ${
                    activity.quantity_change < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {activity.quantity_change > 0 ? '+' : ''}{activity.quantity_change} {activity.unit}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Inventory by Category</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.category_breakdown?.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="text-sm text-gray-600">
                      {category.item_count} items
                      {category.low_items > 0 && (
                        <span className="ml-2 text-red-600 font-semibold">
                          ({category.low_items} low)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        category.low_items > 0 ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                      style={{ 
                        width: `${Math.min((category.item_count / stats.inventory.total_supplies) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Users */}
      {stats?.top_users?.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Users (Last 30 Days)</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {stats.top_users.map((user, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{index + 1}</div>
                  <div className="text-sm font-medium text-gray-900 mt-1">{user.employee_name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {user.transaction_count} transactions
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

