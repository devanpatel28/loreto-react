import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Dashboard from './pages/Dashboard/Dashboard';

import SubjectPaper from './pages/QPG/SubjectPaper';
import CoursePage from './pages/Courses/CoursePage';
import LoginPage from './Temp/LoginPage';
import TeacherPage from './pages/Teacher/TeacherPage';
import AddTeacher from './pages/Teacher/AddTeacher';
import LevelsPage from './pages/Levels/LevelsPage';
import TopicsPage from './pages/Topics/TopicsPage';
import AddCoursePage from './pages/Courses/AddCoursePage';
import AddLevelPage from './pages/Levels/AddLevelPage';
import AddTopic from './pages/Topics/AddTopic';
import AddStudent from './pages/Student/AddStudentPage';
import StudentPage from './pages/Student/StudentPage';

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
        <Route index element={
            <>
              <PageTitle title="LORETO" />
              <LoginPage />
            </>
          }
        />
      
        <Route path="/manage/manage-cources" element={
            <>
              <PageTitle title="Cource" />
              <CoursePage />
            </>
          }
        />
        <Route path="/manage/manage-levels" element={
            <>
              <PageTitle title="Levels" />
              <LevelsPage />
            </>
          }
        />
        <Route path="/manage/manage-topics" element={
            <>
              <PageTitle title="Topics" />
              <TopicsPage />
            </>
          }
        />
        <Route path="/add-teacher" element={
            <>
              <PageTitle title="Add Teacher" />
              <AddTeacher />
            </>
          }
        />
        <Route path="/add-student" element={
            <>
              <PageTitle title="Add Student" />
              <AddStudent />
            </>
          }
        />
        <Route path="/manage-student" element={
            <>
              <PageTitle title="Students" />
              <StudentPage />
            </>
          }
        />
        <Route path="/add-cource" element={
            <>
              <PageTitle title="Add Cource" />
              <AddCoursePage />
            </>
          }
        />
        <Route path="/add-levels" element={
            <>
              <PageTitle title="Add Level" />
              <AddLevelPage />
            </>
          }
        />
        <Route path="/add-topics" element={
            <>
              <PageTitle title="Add Topics" />
              <AddTopic />
            </>
          }
        />
        <Route path="/teachers" element={
            <>
              <PageTitle title="Student" />
              <TeacherPage />
            </>
          }
        />
        <Route path="/dashboard" element={
            <>
              <PageTitle title="Dashboard" />
              <Dashboard />
            </>
          }
        />
        <Route path="/login" element={
            <>
              <PageTitle title="Login" />
              <LoginPage />
            </>
          }
        />
        <Route path="/calendar" element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              {/* <Calendar /> */}
            </>
          }
        />
        <Route path='/qpaper/set-subject-paper' element={
            <>
              <PageTitle title="Set Subject Paper" />
              <SubjectPaper />
            </>
          }
        />

        <Route path='/courses' element={
            <>
              <PageTitle title="Courses" />
              <CoursePage />
            </>
          }
        />
      </Routes>



    </>
  );
}

export default App;
