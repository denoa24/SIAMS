import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { VehiclesPage } from './pages/vehicles/VehiclesPage';
import { AccessRequestsPage } from './pages/accessRequests/AccessRequestsPage';
import { SecurityAlertsPage } from './pages/securityAlerts/SecurityAlertsPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { ArchitecturePage } from './pages/architecture/ArchitecturePage';

function App() {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
      <Route path="/vehicles" element={<VehiclesPage />} />
      <Route path="/access-requests" element={<AccessRequestsPage />}/>
      <Route path="/security-alerts" element={<SecurityAlertsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/architecture" element={<ArchitecturePage />} />
    </Routes>
  );
}

export default App;