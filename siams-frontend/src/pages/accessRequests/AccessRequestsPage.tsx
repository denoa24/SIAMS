import { PageHeader } from '../../components/PageHeader';
import './AccessRequestsPage.css';

type RequestStatus =
  | 'Granted'
  | 'Denied'
  | 'Pending';

type AccessRequest = {
  id: number;
  vehicleId: string;
  rsuId: string;
  timestamp: string;
  status: RequestStatus;
  reason: string;
};

export function AccessRequestsPage() {
  const requests: AccessRequest[] = [
    {
      id: 1,
      vehicleId: 'VH-1024',
      rsuId: 'RSU-04',
      timestamp: '14:32:12',
      status: 'Granted',
      reason: 'Vehicle authenticated successfully',
    },
    {
      id: 2,
      vehicleId: 'VH-2201',
      rsuId: 'RSU-11',
      timestamp: '14:31:04',
      status: 'Denied',
      reason: 'Expired certificate',
    },
    {
      id: 3,
      vehicleId: 'VH-4502',
      rsuId: 'RSU-09',
      timestamp: '14:27:55',
      status: 'Pending',
      reason: 'Awaiting validation',
    },
    {
      id: 4,
      vehicleId: 'VH-8891',
      rsuId: 'RSU-02',
      timestamp: '14:24:40',
      status: 'Granted',
      reason: 'Trusted vehicle',
    },
  ];

  return (
    <div className="access-page">
      <PageHeader
        title="Access Requests"
        description="Monitor vehicle authentication requests and access validation."
      />

      <div className="access-summary">
        <div className="summary-card">
          <h3>Total Requests</h3>
          <p>1248</p>
        </div>

        <div className="summary-card granted-card">
          <h3>Granted</h3>
          <p>1192</p>
        </div>

        <div className="summary-card denied-card">
          <h3>Denied</h3>
          <p>56</p>
        </div>
      </div>

      <div className="requests-card">
        <div className="requests-header">
          <h2>Authentication Requests</h2>

          <button className="simulate-button">
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

                <td className="vehicle-column">
                  {request.vehicleId}
                </td>

                <td>{request.rsuId}</td>

                <td>
                  <span
                    className={`request-status ${request.status.toLowerCase()}`}
                  >
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