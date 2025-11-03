import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Plus, Edit2, Trash2, Save, X, Package } from 'lucide-react';

const Inventory = () => {
  const [supplies, setSupplies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [error, setError] = useState(null);
  const [newSupply, setNewSupply] = useState({
    name: '',
    category_id: '',
    current_quantity: 0,
    min_threshold: 10,
    unit: 'units'
  });

  useEffect(() => {
    fetchSupplies();
    fetchCategories();
  }, []);

  const fetchSupplies = async () => {
    try {
      setError(null);
      const response = await api.get('/inventory/supplies');
      setSupplies(response.data);
    } catch (error) {
      setError('Failed to load supplies. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/inventory/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleEdit = (supply) => {
    setEditingId(supply.id);
    setEditData({
      current_quantity: supply.current_quantity,
      min_threshold: supply.min_threshold
    });
  };

  const handleSave = async (id) => {
    try {
      setError(null);
      await api.put(`/inventory/supplies/${id}`, editData);
      await fetchSupplies();
      setEditingId(null);
      setEditData({});
    } catch (error) {
      setError('Failed to update supply. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await api.delete(`/inventory/supplies/${id}`);
      await fetchSupplies();
      setDeleteConfirmId(null);
    } catch (error) {
      setError('Failed to delete supply. Please try again.');
      setDeleteConfirmId(null);
    }
  };

  const handleAddSupply = async () => {
    try {
      setError(null);
      await api.post('/inventory/supplies', newSupply);
      await fetchSupplies();
      setShowAddModal(false);
      setNewSupply({
        name: '',
        category_id: '',
        current_quantity: 0,
        min_threshold: 10,
        unit: 'units'
      });
    } catch (error) {
      setError('Failed to add supply. Please check all fields and try again.');
    }
  };

  const filteredSupplies = supplies.filter(supply => {
    const matchesSearch = supply.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || supply.category_id === parseInt(filterCategory);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search supplies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <Plus className="h-5 w-5" />
            Add Supply
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Threshold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSupplies.map((supply) => (
                <tr key={supply.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="font-medium text-gray-900">{supply.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {supply.category_name}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === supply.id ? (
                      <input
                        type="number"
                        value={editData.current_quantity}
                        onChange={(e) => setEditData({...editData, current_quantity: parseInt(e.target.value)})}
                        className="w-20 px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-900">
                        {supply.current_quantity} {supply.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === supply.id ? (
                      <input
                        type="number"
                        value={editData.min_threshold}
                        onChange={(e) => setEditData({...editData, min_threshold: parseInt(e.target.value)})}
                        className="w-20 px-2 py-1 border rounded"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">
                        {supply.min_threshold} {supply.unit}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StockBadge status={supply.stock_status} percentage={supply.stock_percentage} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {editingId === supply.id ? (
                        <>
                          <button
                            onClick={() => handleSave(supply.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {setEditingId(null); setEditData({});}}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(supply)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          {deleteConfirmId === supply.id ? (
                            <>
                              <button
                                onClick={() => handleDelete(supply.id)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded font-medium text-xs"
                                title="Confirm delete"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1 text-gray-600 hover:bg-gray-100 rounded font-medium text-xs"
                                title="Cancel"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(supply.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                              title="Delete supply"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supply Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Supply</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Supply Name"
                value={newSupply.name}
                onChange={(e) => setNewSupply({...newSupply, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <select
                value={newSupply.category_id}
                onChange={(e) => setNewSupply({...newSupply, category_id: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Current Quantity"
                  value={newSupply.current_quantity}
                  onChange={(e) => setNewSupply({...newSupply, current_quantity: parseInt(e.target.value)})}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Min Threshold"
                  value={newSupply.min_threshold}
                  onChange={(e) => setNewSupply({...newSupply, min_threshold: parseInt(e.target.value)})}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
              <input
                type="text"
                placeholder="Unit (e.g., units, boxes, vials)"
                value={newSupply.unit}
                onChange={(e) => setNewSupply({...newSupply, unit: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupply}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Add Supply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StockBadge = ({ status, percentage }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'out_of_stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'out_of_stock': return 'Out of Stock';
      case 'low': return 'Low Stock';
      case 'medium': return 'Medium';
      default: return 'Good';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {percentage !== undefined && (
        <span className="text-xs text-gray-500">{percentage}%</span>
      )}
    </div>
  );
};

export default Inventory;
