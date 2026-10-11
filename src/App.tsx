import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import DashboardPage from '@/pages/DashboardPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';

const UniversitiesPage = lazy(() => import('@/pages/UniversitiesPage'));
const ScholarshipsPage = lazy(() => import('@/pages/ScholarshipsPage'));
const AssessmentPage = lazy(() => import('@/pages/AssessmentPage'));
const CareerRoadmapsPage = lazy(() => import('@/pages/CareerRoadmapsPage'));
const CVBuilderPage = lazy(() => import('@/pages/CVBuilderPage'));
const AIGuidancePage = lazy(() => import('@/pages/AIGuidancePage'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-primary-500/20 border-t-primary-400 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Admin routes — outside main Layout, wrapped in AdminAuthProvider */}
        <Route path="/admin/login" element={
          <AdminAuthProvider>
            <AdminLoginPage />
          </AdminAuthProvider>
        } />
        <Route path="/admin/dashboard" element={
          <AdminAuthProvider>
            <AdminDashboardPage />
          </AdminAuthProvider>
        } />

        {/* Main site routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/universities" element={<Suspense fallback={<PageLoader />}><UniversitiesPage /></Suspense>} />
          <Route path="/scholarships" element={<Suspense fallback={<PageLoader />}><ScholarshipsPage /></Suspense>} />
          <Route path="/assessment" element={<Suspense fallback={<PageLoader />}><AssessmentPage /></Suspense>} />
          <Route path="/career-roadmaps" element={<Suspense fallback={<PageLoader />}><CareerRoadmapsPage /></Suspense>} />
          <Route path="/cv-builder" element={<Suspense fallback={<PageLoader />}><CVBuilderPage /></Suspense>} />
          <Route path="/ai-guidance" element={<Suspense fallback={<PageLoader />}><AIGuidancePage /></Suspense>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
