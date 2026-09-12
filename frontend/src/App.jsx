import React, { useState, useEffect } from 'react';

export default function App() {
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, lastPage: 1 });

  // Filters
  const [filters, setFilters] = useState({
    status: '',
    operator: '',
    retailer_id: '',
    from: '',
    to: ''
  });

  // New Recharge Form
  const [form, setForm] = useState({
    retailer_id: '101',
    mobile_number: '',
    operator: 'Airtel',
    amount: '',
    status: 'success'
  });

  const fetchRecharges = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page
      }).toString();

      const res = await fetch(`http://127.0.0.1:8000/api/recharges?${queryParams}`);
      if (!res.ok) throw new Error('API server unreachable');
      
      const data = await res.json();
      setRecharges(data.data || []);
      setPagination({
        page: data.meta?.current_page || 1,
        total: data.meta?.total || 0,
        lastPage: data.meta?.last_page || 1
      });
    } catch (err) {
      console.error(err);
      setError("Backend Disconnected: Live Vercel frontend cannot reach local http://127.0.0.1:8000. Please run `php artisan serve` locally to test full database functionality.");
      setRecharges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecharges(1);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();
    fetchRecharges(1);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/recharges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Submission failed');
      alert('Recharge added successfully!');
      fetchRecharges(1);
    } catch (err) {
      alert('Could not submit. Ensure Laravel local server is running at http://127.0.0.1:8000');
    }
  };

  const labelStyle = {
    display: 'block',
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: '6px',
    fontSize: '14px'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', padding: '30px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Clean Header without broken emojis */}
        <h1 style={{ color: '#ffffff', textAlign: 'center', marginBottom: '30px', fontSize: '28px', lineHeight: '1.2' }}>
          ZuperMoney — Retailer Recharge History
        </h1>

        {/* Form Card */}
        <div style={cardStyle}>
          <h2 style={{ color: '#0f172a', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>Perform New Recharge</h2>
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Retailer ID</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={form.retailer_id}
                  onChange={(e) => setForm({ ...form, retailer_id: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Mobile Number</label>
                <input
                  type="text"
                  placeholder="10-digit number"
                  style={inputStyle}
                  value={form.mobile_number}
                  onChange={(e) => setForm({ ...form, mobile_number: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Operator</label>
                <select
                  style={inputStyle}
                  value={form.operator}
                  onChange={(e) => setForm({ ...form, operator: e.target.value })}
                >
                  <option value="Airtel">Airtel</option>
                  <option value="Jio">Jio</option>
                  <option value="Vi">Vi</option>
                  <option value="BSNL">BSNL</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 299"
                  style={inputStyle}
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Submit Recharge
            </button>
          </form>
        </div>

        {/* Filter Card */}
        <div style={cardStyle}>
          <h2 style={{ color: '#0f172a', marginTop: 0, marginBottom: '20px', fontSize: '20px' }}>Filter Recharges</h2>
          <form onSubmit={handleApplyFilters}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" style={inputStyle} value={filters.status} onChange={handleFilterChange}>
                  <option value="">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Operator</label>
                <select name="operator" style={inputStyle} value={filters.operator} onChange={handleFilterChange}>
                  <option value="">All Operators</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Jio">Jio</option>
                  <option value="Vi">Vi</option>
                  <option value="BSNL">BSNL</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Retailer ID</label>
                <input
                  type="text"
                  name="retailer_id"
                  placeholder="Filter ID"
                  style={inputStyle}
                  value={filters.retailer_id}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#475569',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {/* Error Notice */}
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', fontSize: '14px', lineHeight: '1.5' }}>
            <strong>{error}</strong>
          </div>
        )}

        {/* Table View */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '20px', color: '#ffffff' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '12px', color: '#94a3b8' }}>ID</th>
                <th style={{ padding: '12px', color: '#94a3b8' }}>Retailer</th>
                <th style={{ padding: '12px', color: '#94a3b8' }}>Mobile</th>
                <th style={{ padding: '12px', color: '#94a3b8' }}>Operator</th>
                <th style={{ padding: '12px', color: '#94a3b8' }}>Amount</th>
                <th style={{ padding: '12px', color: '#94a3b8' }}>Status</th>
                <th style={{ padding: '12px', color: '#94a3b8' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>Loading...</td>
                </tr>
              ) : recharges.length > 0 ? (
                recharges.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '12px' }}>{item.id}</td>
                    <td style={{ padding: '12px' }}>{item.retailer_id}</td>
                    <td style={{ padding: '12px' }}>{item.mobile_number}</td>
                    <td style={{ padding: '12px' }}>{item.operator}</td>
                    <td style={{ padding: '12px' }}>₹{item.amount}</td>
                    <td style={{ padding: '12px' }}>{item.status}</td>
                    <td style={{ padding: '12px' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                    No recharge records found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: '#94a3b8' }}>
            <span>Total Records: {pagination.total} | Page {pagination.page} of {pagination.lastPage}</span>
            <div>
              <button
                disabled={pagination.page <= 1}
                onClick={() => fetchRecharges(pagination.page - 1)}
                style={{ marginRight: '8px', opacity: pagination.page <= 1 ? 0.5 : 1 }}
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.lastPage}
                onClick={() => fetchRecharges(pagination.page + 1)}
                style={{ opacity: pagination.page >= pagination.lastPage ? 0.5 : 1 }}
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
