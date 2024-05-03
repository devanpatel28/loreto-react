import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Dashboard from './pages/Dashboard/Dashboard';
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
import ViewStudent from './pages/Student/ViewStudent';
import EventsPage from './pages/Events/EventsPage';
import AddEvent from './pages/Events/AddEvent';
import HolidaysPage from './pages/Holidays/HolidaysPage';
import BooksPage from './pages/Books/BooksPage';
import AddBook from './pages/Books/AddBook';
import AttendancePage from './pages/Attendance/AttendancePage';
import ChatPage from './pages/Chat/ChatPage';

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
      
        <Route path="/manage/manage-courses" element={
            <>
              <PageTitle title="Courses" />
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
        <Route path="/add-course" element={
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
         <Route path="/view-student" element={
            <>
              <PageTitle title="Student Profile" />
              <ViewStudent />
            </>
          }
        />
         <Route path="/attendance" element={
            <>
              <PageTitle title="Attendance" />
              <AttendancePage />
            </>
          }
        />
        <Route path="/chats" element={
            <>
              <PageTitle title="Chats" />
              <ChatPage />
            </>
          }
        />
        <Route path="/events" element={
            <>
              <PageTitle title="Events" />
              <EventsPage />
            </>
          }
        />
        <Route path="/add-event" element={
            <>
              <PageTitle title="Add Event" />
              <AddEvent />
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
              <PageTitle title="Teachers" />
              <TeacherPage />
            </>
          }
        />
         <Route path="/add-book" element={
            <>
              <PageTitle title="Add Book" />
              <AddBook />
            </>
          }
        />
        <Route path="/books" element={
            <>
              <PageTitle title="Books" />
              <BooksPage />
            </>
          }
        />
        <Route path="/holidays" element={
            <>
              <PageTitle title="Holidays" />
              <HolidaysPage />
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
