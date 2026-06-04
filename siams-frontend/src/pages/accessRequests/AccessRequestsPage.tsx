import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { api } from '../../services/api';
import './AccessRequestsPage.css';

type RequestStatus = 'Granted' | 'Denied' | 'Pending';

type AccessRequest = {
  id: number;
  vehicleId: string;
  rsuId: string;
  timestamp: string;
  status: RequestStatus;
  reason: string;
};

export function AccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);

  const loadRequests = async () => {
    const response = await api.get('/access-requests');
    setRequests(response.data);
  };

  const simulateRequest = async () => {
    await api.post('/access-requests/simulate');
    await loadRequests();
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const totalRequests = requests.length;
  const grantedRequests = requests.filter((request) => request.status === 'Granted').length;
  const deniedRequests = requests.filter((request) => request.status === 'Denied').length;

  return (
    <div className="access-page">
      <PageHeader
        title="Access Requests"
        description="Monitor vehicle authentication requests and access validation."
      />

      <div className="access-summary">
        <div className="summary-card">
          <h3>Total Requests</h3>
          <p>{totalRequests}</p>
        </div>

        <div className="summary-card granted-card">
          <h3>Granted</h3>
          <p>{grantedRequests}</p>
        </div>

        <div className="summary-card denied-card">
          <h3>Denied</h3>
          <p>{deniedRequests}</p>
        </div>
      </div>

      <div className="requests-card">
        <div className="requests-header">
          <h2>Authentication Requests</h2>

          <button className="simulate-button" onClick={simulateRequest}>
            Simulate Request
          </button>
        </div>

        <table className="requests-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Vehicle</th>
              <th>RSU</th>
              <th>Status</th>
              <th>Timestamp</th>
              <th>Reason</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>
                <td className="vehicle-column">{request.vehicleId}</td>
                <td>{request.rsuId}</td>

                <td>
                  <span className={`request-status ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </td>

                <td>{request.timestamp}</td>
                <td>{request.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}