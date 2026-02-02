import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/AdminLayout';
import { AcademicStructure, CourseDetail } from './pages';
import { Dashboard, QuestionBank, QuestionCreate, QuestionEdit, Exams, ExamCreate, Users, StudentExams, QuizSolve, Login, QuestionBulkUpload, Unauthorized } from './pages';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRoute } from './components/RoleBasedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student Routes (Full Screen / Different Layout) */}
          <Route path="/quiz/solve/:id" element={
            <ProtectedRoute>
              <QuizSolve />
            </ProtectedRoute>
          } />

          {/* Admin & Teacher Routes with Layout */}
          <Route path="/" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="academic" element={<AcademicStructure />} />
            <Route path="academic/course/:id" element={<CourseDetail />} />
            <Route path="questions" element={<QuestionBank />} />
            <Route path="questions/new" element={<QuestionCreate />} />
            <Route path="questions/edit/:id" element={<QuestionEdit />} />
            <Route path="questions/bulk" element={<QuestionBulkUpload />} />
            <Route path="exams" element={<Exams />} />
            <Route path="exams/new" element={<ExamCreate />} />

            {/* Admin Only Routes */}
            <Route path="users" element={
              <RoleBasedRoute allowedRoles={['admin']}>
                <Users />
              </RoleBasedRoute>
            } />

            {/* Student Routes */}
            <Route path="student/exams" element={<StudentExams />} />
            <Route path="achievements" element={<div className="p-6">Rozetler yakında burada.</div>} />
            <Route path="settings" element={<div className="p-6">Ayarlar yakında burada.</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;



