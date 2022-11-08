import styles from "./App.module.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import PrivateAdminRoute from "./components/routing/PrivateAdminRoute";
import Degrees from "./pages/admin/Degrees";
import Majors from "./pages/admin/Majors";
import Courses from "./pages/admin/Courses";
import Students from "./pages/admin/Students";
import Minors from "./pages/admin/Minors";
import UserHome from "./pages/user/UserHome";
import UserRecommend from "./pages/user/UserRecommend";
import UserCourses from "./pages/user/UserCourses";
import UserProfile from "./pages/user/UserProfile";
import PrivateUserRoute from "./components/routing/PrivateUserRoute";

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Navbar />
        <div className={styles.container}>
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<PrivateUserRoute />}>
              <Route path="/user/me" element={<UserHome />} />
              {/* Change these paths to the actual endpoints you will be using */}
              <Route path="/user/recommend" element={<UserRecommend />} />
              <Route path="/user/courses" element={<UserCourses />} />
              <Route path="/user/profile" element={<UserProfile />} />
            </Route>
            <Route element={<PrivateAdminRoute />}>
              <Route path="/admin/degrees" element={<Degrees />} />
              <Route path="/admin/majors" element={<Majors />} />
              <Route path="/admin/minors" element={<Minors />} />
              <Route path="/admin/courses" element={<Courses />} />
              <Route path="/admin/students" element={<Students />} />
            </Route>

            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
