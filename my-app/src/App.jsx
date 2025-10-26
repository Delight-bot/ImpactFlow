import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Layout from './Layout';
import Landing from './Landing';
import VolunteerSignup from './VolunteerSignup';
import BeneficiarySignup from './BeneficiarySignup';
import VolunteerLogin from './VolunteerLogin';
import BeneficiaryLogin from './BeneficiaryLogin';
import UserDashboard from './UserDashboard';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

// Import admin components
import Matched from './admin/Matched';
import VacantVolunteers from './admin/VacantVolunteers';
import VacantBeneficiaries from './admin/VacantBeneficiaries';
import VerifyVolunteers from './admin/VerifyVolunteers';
import VerifyBeneficiaries from './admin/VerifyBeneficiaries';
import FlaggedMessages from './admin/FlaggedMessages';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
          
          {/* Volunteer & Beneficiary routes */}
          <Route path="/signup/volunteer" element={<VolunteerSignup />} />
          <Route path="/signup/beneficiary" element={<BeneficiarySignup />} />
          <Route path="/login/volunteer" element={<VolunteerLogin />} />
          <Route path="/login/beneficiary" element={<BeneficiaryLogin />} />
          <Route path="/volunteer/dashboard" element={<UserDashboard />} />
          <Route path="/beneficiary/dashboard" element={<UserDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/matched"
            element={
              <ProtectedRoute>
                <Matched />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vacant-volunteers"
            element={
              <ProtectedRoute>
                <VacantVolunteers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vacant-beneficiaries"
            element={
              <ProtectedRoute>
                <VacantBeneficiaries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verify-volunteers"
            element={
              <ProtectedRoute>
                <VerifyVolunteers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verify-beneficiaries"
            element={
              <ProtectedRoute>
                <VerifyBeneficiaries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/flagged-messages"
            element={
              <ProtectedRoute>
                <FlaggedMessages />
              </ProtectedRoute>
            }
          />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
