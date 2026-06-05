import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { DashboardPage } from './pages/dashboard/DashboardPage';
import { VehiclesPage } from './pages/vehicles/VehiclesPage';
import { AccessRequestsPage } from './pages/accessRequests/AccessRequestsPage';
import { SecurityAlertsPage } from './pages/securityAlerts/SecurityAlertsPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { ArchitecturePage } from './pages/architecture/ArchitecturePage';
import { LiveMapPage } from './pages/liveMap/LiveMapPage';
import { RsuMonitoringPage } from './pages/rsuMonitoring/RsuMonitoringPage';

function App() {
  return (
  <>
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/access-requests" element={<AccessRequestsPage />} />
      <Route path="/security-alerts" element={<SecurityAlertsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/architecture" element={<ArchitecturePage />} />
      <Route path="/live-map" element={<LiveMapPage />} />
      <Route path="/rsu-monitoring" element={<RsuMonitoringPage />} />
    </Routes>

    <ToastContainer
      position="top-right"
      autoClose={2500}
      theme="dark"
    />
  </>
);
}

export default App;