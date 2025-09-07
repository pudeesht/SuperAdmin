import React, { useState, useEffect } from 'react';
import * as api from '../services/api';

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await api.getAuditLogs();
        setLogs(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (isLoading) return <p>Loading audit logs...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h3>Audit Logs</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Actor</th>
            <th>Action</th>
            <th>Target</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.actor.name} ({log.actor.email})</td>
              <td>{log.action}</td>
              <td>{log.targetType}: {log.targetId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AuditLogs;