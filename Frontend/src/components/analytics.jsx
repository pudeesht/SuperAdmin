import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '16px',
  margin: '8px',
  textAlign: 'center',
  minWidth: '150px',
};

const containerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
};

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.getAnalytics();
        setSummary(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (isLoading) return <p>Loading analytics...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!summary) return null;

  return (
    <div>
      <h3>Analytics Summary</h3>
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h4>Total Users</h4>
          <p style={{ fontSize: '2em' }}>{summary.totalUsers}</p>
        </div>
        <div style={cardStyle}>
          <h4>Total Roles</h4>
          <p style={{ fontSize: '2em' }}>{summary.totalRoles}</p>
        </div>
        <div style={cardStyle}>
          <h4>Active Users (7d)</h4>
          <p style={{ fontSize: '2em' }}>{summary.activeUsersLast7Days}</p>
        </div>
      </div>
    </div>
  );
}

// export default Analytics;