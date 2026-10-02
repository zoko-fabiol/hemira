import React from 'react';
import AdminApp from '../../admin hemira/src/App';

export default function AdminView({ onBackToSite }) {
  return (
    <div style={{ position: 'relative', zIndex: 10000 }}>
      <AdminApp />
    </div>
  );
}
