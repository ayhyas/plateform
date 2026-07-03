import { Routes, Route, Navigate } from 'react-router-dom';
import StudentLogin from './pages/StudentLogin.jsx';
import Exam from './pages/Exam.jsx';
import ExamComplete from './pages/ExamComplete.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminResults from './pages/AdminResults.jsx';
import AdminQuestions from './pages/AdminQuestions.jsx';
import AdminSettings from './pages/AdminSettings.jsx';
import ProtectedAdminRoute from './components/ProtectedAdminRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentLogin />} />
      <Route path="/exam" element={<Exam />} />
      <Route path="/exam/termine" element={<ExamComplete />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route index element={<Navigate to="resultats" replace />} />
        <Route path="resultats" element={<AdminResults />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="parametres" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
