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

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedRsu, setSelectedRsu] = useState('');

  const loadRequests = async () => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.append('search', search.trim());
    }

    if (selectedStatus) {
      params.append('status', selectedStatus);
    }

    if (selectedRsu) {
      params.append('rsu', selectedRsu);
    }

    const queryString = params.toString();
    const url = queryString ? `/access-requests?${queryString}` : '/access-requests';

    const response = await api.get(url);
    setRequests(response.data);
  };

  const simulateRequest = async () => {
    await api.post('/access-requests/simulate');
    await loadRequests();
  };

  const approveRequest = async (requestId: number) => {
    await api.put(`/access-requests/${requestId}/approve`);
    await loadRequests();
  };

  const rejectRequest = async (requestId: number) => {
    await api.put(`/access-requests/${requestId}/reject`);
    await loadRequests();
  };

  const resetFilters = async () => {
    setSearch('');
    setSelectedStatus('');
    setSelectedRsu('');

    const response = await api.get('/access-requests');
    setRequests(response.data);
  };

  useEffect(() => {
    api.get('/access-requests').then((response) => {
      setRequests(response.data);
    });
  }, []);

  const totalRequests = requests.length;

  const grantedRequests = requests.filter(
    (request) => request.status === 'Granted'
  ).length;

  const deniedRequests = requests.filter(
    (request) => request.status === 'Denied'
  ).length;

  const pendingRequests = requests.filter(
    (request) => request.status === 'Pending'
  ).length;

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

        <div className="summary-card pending-card">
          <h3>Pending</h3>
          <p>{pendingRequests}</p>
        </div>
      </div>

      <div className="access-filters">
        <input
          type="text"
          placeholder="Search vehicle ID..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              loadRequests();
            }
          }}
        />

        <select
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          <option value="">All statuses</option>
          <option value="Granted">Granted</option>
          <option value="Denied">Denied</option>
          <option value="Pending">Pending</option>
        </select>

        <select
          value={selectedRsu}
          onChange={(event) => setSelectedRsu(event.target.value)}
        >
          <option value="">All RSUs</option>
          <option value="RSU-02">RSU-02</option>
          <option value="RSU-04">RSU-04</option>
          <option value="RSU-09">RSU-09</option>
          <option value="RSU-11">RSU-11</option>
        </select>

        <button className="simulate-button" onClick={loadRequests}>
          Search
        </button>

        <button className="access-reset-button" onClick={resetFilters}>
          Reset
        </button>
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
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.id}</td>

                <td className="vehicle-column">
                  {request.vehicleId}
                </td>

                <td>{request.rsuId}</td>

                <td>
                  <span className={`request-status ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                </td>

                <td>{request.timestamp}</td>

                <td>{request.reason}</td>

                <td>
                  {request.status === 'Pending' ? (
                    <div className="request-actions">
                      <button
                        className="approve-request-button"
                        onClick={() => approveRequest(request.id)}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-request-button"
                        onClick={() => rejectRequest(request.id)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="no-action-text">
                      No action
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="empty-table-message">
                  No access requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}