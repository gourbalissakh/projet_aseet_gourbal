import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { GestionEtudiantsPage } from './pages/GestionEtudiantsPage';
import { GestionEnseignantsPage } from './pages/GestionEnseignantsPage';
import { GestionAdminsPage } from './pages/GestionAdminsPage';
import { GestionFilieresPage } from './pages/GestionFilieresPage';
import { GestionNiveauxPage } from './pages/GestionNiveauxPage';
import { GestionClassesPage } from './pages/GestionClassesPage';
import { GestionCoursPage } from './pages/GestionCoursPage';
import { GestionEmploiTempsPage } from './pages/GestionEmploiTempsPage';
import { ProfilPage } from './pages/ProfilPage';
import { ParametresPage } from './pages/ParametresPage';
import { FilieresPage } from './pages/FilieresPage';
import { NiveauxPage } from './pages/NiveauxPage';
import { ClassesPage } from './pages/ClassesPage';
import { CoursPage } from './pages/CoursPage';
import { EmploisTempsPage } from './pages/EmploisTempsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';

function App() {
  const { initAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <LoginPage />
          }
        />

        {/* Protected Admin Routes with AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="etudiants" element={<GestionEtudiantsPage />} />
          <Route path="enseignants" element={<GestionEnseignantsPage />} />
          <Route path="admins" element={<GestionAdminsPage />} />
          <Route path="filieres" element={<GestionFilieresPage />} />
          <Route path="niveaux" element={<GestionNiveauxPage />} />
          <Route path="classes" element={<GestionClassesPage />} />
          <Route path="cours" element={<GestionCoursPage />} />
          <Route path="emplois-temps" element={<GestionEmploiTempsPage />} />
          <Route path="profil" element={<ProfilPage />} />
          <Route path="parametres" element={<ParametresPage />} />
        </Route>

        {/* Redirections */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Error Pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Catch all - 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
