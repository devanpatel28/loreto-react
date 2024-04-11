import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Dashboard from './pages/Dashboard/Dashboard';

import SubjectPaper from './pages/QPG/SubjectPaper';
import CoursePage from './pages/Courses/CoursePage';
import ManageSubject from './pages/Subject/ManageSubject';
import LoginPage from './Temp/LoginPage';
import StudentPage from './pages/Student/StudentPage';
import TeacherPage from './pages/Teacher/TeacherPage';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="LORETO"/>
              <LoginPage />
            </>
          }
        />
        <Route
          path="/students"
          element={
            <>
              <PageTitle title="Student" />
              <StudentPage />
            </>
          }
        />
         <Route
          path="/teachers"
          element={
            <>
              <PageTitle title="Student" />
              <TeacherPage />
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <PageTitle title="Dashboard" />
              <Dashboard />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="Login" />
              <LoginPage />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              {/* <Calendar /> */}
            </>
          }
        />
        <Route
          path='/qpaper/set-subject-paper'
          element={
            <>
              <PageTitle title="Set Subject Paper" />
              <SubjectPaper />
            </>
          }
        />

        <Route
          path='/courses'
          element={
            <>
              <PageTitle title="Courses" />
              <CoursePage />
            </>
          }
        />

        <Route
          path='/subject/manage_subject'
          element={
            <>
              <PageTitle title="Manage Subject" />
              <ManageSubject />
            </>
          }
        />
      </Routes>

      
      
    </>
  );
}

export default App;
