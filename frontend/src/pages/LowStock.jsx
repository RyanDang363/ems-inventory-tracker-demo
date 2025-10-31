import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown } from 'lucide-react';
import StockBadge from '../components/StockBadge';
import { apiCall } from '../utils/api';

const LowStock = () => {
  const [lowStockSupplies, setLowStockSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockSupplies();
    // Refresh every 30 seconds
    const interval = setInterval(fetchLowStockSupplies, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLowStockSupplies = async () => {
    try {
      const response = await apiCall('/api/supplies/low');
      const data = await response.json();
      setLowStockSupplies(data);
    } catch (error) {
      console.error('Error fetching low stock supplies:', error);
    } finally {
      setLoading(false);
    }
  };

  const criticalSupplies = lowStockSupplies.filter(s => s.stock_status === 'low');
  const warningSupplies = lowStockSupplies.filter(s => s.stock_status === 'medium');

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
        <h2 className="text-2xl font-bold text-gray-900">Low Stock Alerts</h2>
        <p className="text-gray-600 mt-1">Monitor supplies that need restocking</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Low Stock</p>
              <p className="text-3xl font-bold text-gray-900">{lowStockSupplies.length}</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <TrendingDown className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Critical</p>
              <p className="text-3xl font-bold text-red-600">{criticalSupplies.length}</p>
              <p className="text-xs text-gray-500 mt-1">Immediate action required</p>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Warning</p>
              <p className="text-3xl font-bold text-yellow-600">{warningSupplies.length}</p>
              <p className="text-xs text-gray-500 mt-1">Restock soon</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {lowStockSupplies.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Good! 🎉</h3>
          <p className="text-gray-600">All supplies are adequately stocked.</p>
        </div>
      ) : (
        <>
          {/* Critical Supplies */}
          {criticalSupplies.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 bg-red-50 border-b border-red-100">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-red-900">
                    Critical - Immediate Restock Required ({criticalSupplies.length})
                  </h3>
                </div>
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
                          Location
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
                      {criticalSupplies.map((supply) => {
                        const percentage = (supply.current_quantity / supply.min_threshold) * 100;
                        return (
                          <tr key={supply.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{supply.name}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {supply.category_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {supply.location || 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-red-600">
                                {supply.current_quantity} {supply.unit}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {supply.min_threshold} {supply.unit}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                                  <div
                                    className="h-2 rounded-full bg-red-600"
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-red-600">
                                  {Math.round(percentage)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Warning Supplies */}
          {warningSupplies.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
                <div className="flex items-center">
                  <TrendingDown className="h-5 w-5 text-yellow-600 mr-2" />
                  <h3 className="text-lg font-semibold text-yellow-900">
                    Warning - Restock Soon ({warningSupplies.length})
                  </h3>
                </div>
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
                          Location
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
                      {warningSupplies.map((supply) => {
                        const percentage = (supply.current_quantity / supply.min_threshold) * 100;
                        return (
                          <tr key={supply.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{supply.name}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {supply.category_name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {supply.location || 'N/A'}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-yellow-600">
                                {supply.current_quantity} {supply.unit}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              {supply.min_threshold} {supply.unit}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
                                  <div
                                    className="h-2 rounded-full bg-yellow-600"
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs font-medium text-yellow-600">
                                  {Math.round(percentage)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Action Reminder */}
      {lowStockSupplies.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-900">Restocking Reminder</h3>
              <p className="mt-1 text-sm text-blue-700">
                Please place orders for low stock items to ensure continuous availability of medical supplies.
                Contact your supplier or use your standard ordering process.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LowStock;

