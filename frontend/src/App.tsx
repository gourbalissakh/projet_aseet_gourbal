import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { EtudiantLayout } from './layouts/EtudiantLayout';
import { EnseignantLayout } from './layouts/EnseignantLayout';
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
// Pages Étudiant
import { DashboardEtudiantPage } from './pages/DashboardEtudiantPage';
import { NotesPage } from './pages/NotesPage';
import { MesEmploisTempsPage } from './pages/MesEmploisTempsPage';
import { MesCoursPage } from './pages/MesCoursPage';
// Pages Enseignant
import { DashboardEnseignantPage } from './pages/DashboardEnseignantPage';
import { GestionNotesPage } from './pages/enseignant/GestionNotesPage';
import { MonEmploiTempsPage } from './pages/enseignant/MonEmploiTempsPage';

function App() {
  const { initAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Redirection intelligente basée sur le rôle
  const getDefaultRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'etudiant':
        return '/etudiant/dashboard';
      case 'enseignant':
        return '/enseignant/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

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
            isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />
          }
        />

        {/* Protected Admin Routes with AdminLayout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
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

        {/* Protected Etudiant Routes with EtudiantLayout */}
        <Route
          path="/etudiant"
          element={
            <ProtectedRoute allowedRoles={['etudiant']}>
              <EtudiantLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardEtudiantPage />} />
          <Route path="cours" element={<MesCoursPage />} />
          <Route path="emplois-temps" element={<MesEmploisTempsPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="profil" element={<ProfilPage />} />
        </Route>

        {/* Protected Enseignant Routes with EnseignantLayout */}
        <Route
          path="/enseignant"
          element={
            <ProtectedRoute allowedRoles={['enseignant']}>
              <EnseignantLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardEnseignantPage />} />
          <Route path="cours" element={<MesCoursPage />} />
          <Route path="notes" element={<GestionNotesPage />} />
          <Route path="emplois-temps" element={<MonEmploiTempsPage />} />
          <Route path="profil" element={<ProfilPage />} />
        </Route>

        {/* Redirections */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to={getDefaultRoute()} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="/dashboard" element={<Navigate to={getDefaultRoute()} replace />} />
        
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
