import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function App() {
  const [recharges, setRecharges] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    operator: '',
    retailer_id: '',
    from_date: '',
    to_date: '',
    page: 1,
  });

  // New Recharge Form state (with status included)
  const [formData, setFormData] = useState({
    retailer_id: '101',
    mobile_number: '',
    operator: 'Airtel',
    amount: '',
    status: 'success',
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSuccess, setFormSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch recharges on filter or page change
  const fetchRecharges = async () => {
    setLoading(true);
    setError('');
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const response = await fetch(`${API_BASE_URL}/recharges?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch recharge history.');
      
      const data = await response.json();
      setRecharges(data.data || []);
      setPagination({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1,
        total: data.total || 0,
      });
    } catch (err) {
      setError(err.message || 'Error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecharges();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRechargeSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setFormSuccess('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/recharges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setFormErrors(result.errors);
        } else {
          setFormErrors({ general: result.message || 'Failed to submit recharge.' });
        }
        return;
      }

      setFormSuccess('Recharge successfully submitted!');
      setFormData({ retailer_id: '101', mobile_number: '', operator: 'Airtel', amount: '', status: 'success' });
      fetchRecharges(); // Refresh list
    } catch (err) {
      setFormErrors({ general: 'Server connection failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#d1fae5', color: '#065f46', fontWeight: 'bold' }}>Success</span>;
      case 'failed':
        return <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 'bold' }}>Failed</span>;
      default:
        return <span style={{ padding: '4px 8px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: 'bold' }}>Pending</span>;
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Retailer Recharge History</h1>

      {/* New Recharge Form Section */}
      <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Perform New Recharge</h2>
        
        {formSuccess && <div style={{ color: '#065f46', backgroundColor: '#d1fae5', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>{formSuccess}</div>}
        {formErrors.general && <div style={{ color: '#991b1b', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>{formErrors.general}</div>}

        <form onSubmit={handleRechargeSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Retailer ID</label>
            <input type="number" name="retailer_id" value={formData.retailer_id} onChange={handleFormChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            {formErrors.retailer_id && <small style={{ color: 'red' }}>{formErrors.retailer_id[0]}</small>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Mobile Number</label>
            <input type="text" name="mobile_number" placeholder="10-digit number" value={formData.mobile_number} onChange={handleFormChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            {formErrors.mobile_number && <small style={{ color: 'red' }}>{formErrors.mobile_number[0]}</small>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Operator</label>
            <select name="operator" value={formData.operator} onChange={handleFormChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="Airtel">Airtel</option>
              <option value="Jio">Jio</option>
              <option value="Vi">Vi</option>
              <option value="BSNL">BSNL</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Amount (₹)</label>
            <input type="number" name="amount" placeholder="e.g. 299" value={formData.amount} onChange={handleFormChange} required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            {formErrors.amount && <small style={{ color: 'red' }}>{formErrors.amount[0]}</small>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Status</label>
            <select name="status" value={formData.status} onChange={handleFormChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <button type="submit" disabled={submitting} style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {submitting ? 'Processing...' : 'Submit Recharge'}
            </button>
          </div>
        </form>
      </div>

      {/* Server-side Filter Section */}
      <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Filter Recharges</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Operator</label>
            <select name="operator" value={filters.operator} onChange={handleFilterChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="">All Operators</option>
              <option value="Airtel">Airtel</option>
              <option value="Jio">Jio</option>
              <option value="Vi">Vi</option>
              <option value="BSNL">BSNL</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>Retailer ID</label>
            <input type="text" name="retailer_id" placeholder="Filter ID" value={filters.retailer_id} onChange={handleFilterChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>From Date</label>
            <input type="date" name="from_date" value={filters.from_date} onChange={handleFilterChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px' }}>To Date</label>
            <input type="date" name="to_date" value={filters.to_date} onChange={handleFilterChange} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
        </div>
      </div>

      {/* History Table Section */}
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Retailer</th>
              <th style={{ padding: '12px' }}>Mobile</th>
              <th style={{ padding: '12px' }}>Operator</th>
              <th style={{ padding: '12px' }}>Amount</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>Loading recharge records...</td></tr>
            ) : recharges.length === 0 ? (
              <tr><td colSpan="7" style={{ padding: '20px', textAlign: 'center' }}>No recharge records found matching criteria.</td></tr>
            ) : (
              recharges.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>#{item.id}</td>
                  <td style={{ padding: '12px' }}>Retailer #{item.retailer_id}</td>
                  <td style={{ padding: '12px' }}>{item.mobile_number}</td>
                  <td style={{ padding: '12px' }}>{item.operator}</td>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>₹{item.amount}</td>
                  <td style={{ padding: '12px' }}>{getStatusBadge(item.status)}</td>
                  <td style={{ padding: '12px' }}>{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Total Records: <strong>{pagination.total}</strong> | Page {pagination.current_page} of {pagination.last_page}
        </p>
        <div>
          <button
            disabled={pagination.current_page <= 1 || loading}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            style={{ padding: '6px 12px', marginRight: '8px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            Previous
          </button>
          <button
            disabled={pagination.current_page >= pagination.last_page || loading}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}