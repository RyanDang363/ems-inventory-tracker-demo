import React from 'react';

const StockBadge = ({ status }) => {
  const badges = {
    low: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Critical Low'
    },
    medium: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Low Stock'
    },
    good: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'In Stock'
    }
  };

  const badge = badges[status] || badges.good;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
      {badge.label}
    </span>
  );
};

export default StockBadge;

