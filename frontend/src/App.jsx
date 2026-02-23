import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PermitTypeListPage from './pages/PermitTypeListPage';
import ApplicationFormPage from './pages/ApplicationFormPage';
import ApplicationListPage from './pages/ApplicationListPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import StaffApplicationsPage from './pages/StaffApplicationsPage';
import DocumentCenterPage from './pages/DocumentCenterPage';
import PropertySearchPage from './pages/PropertySearchPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="permits" element={<PermitTypeListPage />} />
            <Route path="permits/apply/:id" element={<ApplicationFormPage />} />
            <Route path="applications" element={<ApplicationListPage />} />
            <Route path="applications/staff" element={<StaffApplicationsPage />} />
            <Route path="applications/:id" element={<ApplicationDetailPage />} />
            <Route path="documents" element={<DocumentCenterPage />} />
            <Route path="property-records" element={<PropertySearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
