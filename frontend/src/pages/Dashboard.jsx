import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown, 
  CheckCircle,
  Activity,
  Clock,
  AlertCircle,
  PackageX
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/inventory/dashboard');
      setData(response.data);
    } catch (error) {
      // Silently handle error - will show empty state
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Supplies"
          value={stats.total_supplies || 0}
          icon={Package}
          color="blue"
          subtitle="Items tracked"
        />
        <StatCard
          title="Out of Stock"
          value={stats.out_of_stock || 0}
          icon={PackageX}
          color="red"
          subtitle="Needs immediate restock"
          alert={stats.out_of_stock > 0}
        />
        <StatCard
          title="Low Stock"
          value={stats.low_stock || 0}
          icon={AlertTriangle}
          color="yellow"
          subtitle="Below threshold"
        />
        <StatCard
          title="Good Stock"
          value={stats.good_stock || 0}
          icon={CheckCircle}
          color="green"
          subtitle="Adequate levels"
        />
      </div>

      {/* Recent Transactions - Full Width */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gray-500" />
            Recent Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {data?.recentTransactions?.length > 0 ? (
              data.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'use' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <Activity className={`h-4 w-4 ${
                      transaction.type === 'use' ? 'text-red-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{transaction.supply_name}</p>
                    <p className="text-sm text-gray-600">
                      {Math.abs(transaction.quantity_change)} {transaction.unit} • {transaction.type}
                    </p>
                    <p className="text-xs text-gray-500">{transaction.employee_name}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No recent transactions</p>
            )}
          </div>
        </div>
      </div>

      {/* Most Used Supplies */}
      {data?.mostUsed?.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Most Used Supplies (Last 30 Days)</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {data.mostUsed.map((item, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">{item.total_used}</div>
                  <div className="text-sm font-medium text-gray-900 mt-1">{item.name}</div>
                  <div className="text-xs text-gray-500">{item.unit}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, subtitle, alert }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-full ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {alert && (
        <div className="mt-3 flex items-center text-red-600">
          <AlertCircle className="h-4 w-4 mr-1" />
          <span className="text-xs font-medium">Immediate attention required</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
