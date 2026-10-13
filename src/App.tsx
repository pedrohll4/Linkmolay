import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { MyJobsPage } from './pages/MyJobsPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { TalentSearchPage } from './pages/TalentSearchPage';
import { NetworkPage } from './pages/NetworkPage';
import { MessagesPage } from './pages/MessagesPage';
import { ChaptersPage } from './pages/ChaptersPage';
import { ChapterDetailPage } from './pages/ChapterDetailPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailPage } from './pages/CompanyDetailPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SettingsPage } from './pages/SettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <BrowserRouter>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cadastro" element={<RegisterPage />} />

              {/* Rotas Privadas / Autenticadas */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/meu-perfil" element={<MyProfilePage />} />
                <Route path="/perfil/:id" element={<UserProfilePage />} />
                <Route path="/oportunidades" element={<JobsPage />} />
                <Route path="/oportunidades/:id" element={<JobDetailPage />} />
                <Route path="/minhas-vagas" element={<MyJobsPage />} />
                <Route path="/minhas-candidaturas" element={<MyApplicationsPage />} />
                <Route path="/talentos" element={<TalentSearchPage />} />
                <Route path="/rede" element={<NetworkPage />} />
                <Route path="/mensagens" element={<MessagesPage />} />
                <Route path="/capitulos" element={<ChaptersPage />} />
                <Route path="/capitulos/:id" element={<ChapterDetailPage />} />
                <Route path="/empresas" element={<CompaniesPage />} />
                <Route path="/empresas/:id" element={<CompanyDetailPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/configuracoes" element={<SettingsPage />} />
              </Route>

              {/* Rota Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
