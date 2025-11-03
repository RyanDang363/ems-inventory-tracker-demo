import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { AlertTriangle, Package, TrendingDown, PackageX } from 'lucide-react';

const LowStock = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStockSupplies();
  }, []);

  const fetchLowStockSupplies = async () => {
    try {
      const response = await api.get('/inventory/low-stock');
      setSupplies(response.data);
    } catch (error) {
      console.error('Error fetching low stock supplies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (id, newQuantity) => {
    try {
      await api.put(`/inventory/supplies/${id}`, { current_quantity: newQuantity });
      await fetchLowStockSupplies();
    } catch (error) {
      console.error('Error updating supply:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const outOfStock = supplies.filter(s => s.stock_status === 'out_of_stock');
  const lowStock = supplies.filter(s => s.stock_status === 'low');
  const mediumStock = supplies.filter(s => s.stock_status === 'medium');

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {outOfStock.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-red-800">Critical Alert</h3>
              <p className="text-red-700">{outOfStock.length} items are completely out of stock!</p>
            </div>
          </div>
        </div>
      )}

      {/* Out of Stock Section */}
      {outOfStock.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b bg-red-50">
            <h2 className="text-lg font-semibold text-red-900 flex items-center">
              <PackageX className="h-5 w-5 mr-2" />
              Out of Stock ({outOfStock.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outOfStock.map(supply => (
                <StockCard key={supply.id} supply={supply} onRestock={handleRestock} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Low Stock Section */}
      {lowStock.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b bg-yellow-50">
            <h2 className="text-lg font-semibold text-yellow-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Low Stock ({lowStock.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStock.map(supply => (
                <StockCard key={supply.id} supply={supply} onRestock={handleRestock} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Medium Stock Section */}
      {mediumStock.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b bg-orange-50">
            <h2 className="text-lg font-semibold text-orange-900 flex items-center">
              <TrendingDown className="h-5 w-5 mr-2" />
              Below Optimal ({mediumStock.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediumStock.map(supply => (
                <StockCard key={supply.id} supply={supply} onRestock={handleRestock} />
              ))}
            </div>
          </div>
        </div>
      )}

      {supplies.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Stock Levels Good!</h3>
          <p className="text-gray-600">No items are currently low on stock.</p>
        </div>
      )}
    </div>
  );
};

const StockCard = ({ supply, onRestock }) => {
  const [restocking, setRestocking] = useState(false);
  const [newQuantity, setNewQuantity] = useState(supply.current_quantity);

  const handleRestock = () => {
    onRestock(supply.id, newQuantity);
    setRestocking(false);
  };

  const getStatusColor = () => {
    if (supply.stock_status === 'out_of_stock') return 'border-red-300 bg-red-50';
    if (supply.stock_status === 'low') return 'border-yellow-300 bg-yellow-50';
    return 'border-orange-300 bg-orange-50';
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900">{supply.name}</h3>
        {supply.stock_status === 'out_of_stock' && (
          <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded">OUT</span>
        )}
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Category:</span>
          <span className="font-medium">{supply.category_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current:</span>
          <span className="font-medium">{supply.current_quantity} {supply.unit}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Minimum:</span>
          <span className="font-medium">{supply.min_threshold} {supply.unit}</span>
        </div>
      </div>

      {/* Stock Level Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              supply.stock_status === 'out_of_stock' ? 'bg-red-600' :
              supply.stock_status === 'low' ? 'bg-yellow-600' : 'bg-orange-600'
            }`}
            style={{ width: `${Math.min(supply.stock_percentage || 0, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-600 mt-1">{supply.stock_percentage}% of minimum</p>
      </div>

      {/* Restock Button/Form */}
      {restocking ? (
        <div className="mt-4 space-y-2">
          <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(parseInt(e.target.value))}
            className="w-full px-3 py-1 border rounded text-sm"
            placeholder="New quantity"
          />
          <div className="flex gap-2">
            <button
              onClick={handleRestock}
              className="flex-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => {setRestocking(false); setNewQuantity(supply.current_quantity);}}
              className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setRestocking(true)}
          className="w-full mt-4 px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
        >
          Restock
        </button>
      )}
    </div>
  );
};

export default LowStock;
