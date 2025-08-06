import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import LandingPage from "./Components/Hero";
import LoginPage from "./Components/Auth/Loginpage";
import RegisterOrganization from "./Components/Auth/RegisterOrg";
import RegisterUser from "./Components/Auth/RegisterUser";
import AdminDashboard from "./Components/dashboard/AdminDashboard";
import UserDashboard from "./Components/dashboard/UserDashboard";
 import KanbanBoard from "./Components/kanban/KanbanBoard";
 //import ProjectChat from "./Components/profile/ProfilePage";
import ProfilePage from "./Components/profile/ProfilePage";
 import SettingsPage from "./Components/settings/SettingPage";
import About from "./Components/About/About";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendurl } from "../src/API/backendUrl";
import axios from "axios";
import { useUserStore } from "../src/contexts/User.store";

const AppContent: React.FC = () => {
  const {
    user: currentUser,
    org: currentOrg,
    isAuth,
    setUser,
    setOrg,
  } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

// useEffect(() => {
//   const fetchCurrent = async () => {
//     try {
//       // Try fetching user
//       const userResponse = await axios.get(`${backendurl}/profile/currentUser`, {
//         withCredentials: true,
//       });

//       if (userResponse.status === 200) {
//         setUser(userResponse.data.data);
//         setIsLoading(false);
//         return; // ✅ Stop here, don't check org
//       }
//     } catch (error: any) {
//       if (error.response?.status !== 401) {
//         console.error("User fetch error:", error.response?.data?.message);
//       }
//     }

//     try {
//       // If no user, try fetching org
//       const orgResponse = await axios.get(`${backendurl}/profile/currentOrg`, {
//         withCredentials: true,
//       });

//       if (orgResponse.status === 200) {
//         setOrg(orgResponse.data.data);
//       }
//     } catch (error: any) {
//       if (error.response?.status === 401) {
//         toast.error("Please log in");
//       } else {
//         console.error("Org fetch error:", error.response?.data?.message);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   fetchCurrent();
// }, [setUser, setOrg]);



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Router>
        {isAuth && <Navbar />}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Routes>
            {/* Home */}
            <Route
              path="/"
              element={
                isAuth ? (
                  currentOrg ? (
                    <Navigate
                      to={
                        currentOrg.role === "ADMIN"
                          ? "/admin-dashboard"
                          : "/user-dashboard"
                      }
                    />
                  ) : (
                    <Navigate to="/user-dashboard" />
                  )
                ) : (
                  <LandingPage />
                )
              }
            />

            {/* Login */}
            <Route
              path="/login"
              element={isAuth ? <Navigate to="/" /> : <LoginPage />}
            />

            <Route
              path="/register-organization"
              element={isAuth ? <Navigate to="/" /> : <RegisterOrganization />}
            />
            <Route
              path="/register-user"
              element={isAuth ? <Navigate to="/" /> : <RegisterUser />}
            />
            <Route path="/about-us" element={<About />} />

            {/* Protected Routes */}
            <Route
              path="/admin-dashboard"
              element={
                currentOrg?.role === "ADMIN" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/user-dashboard"
              element={
                currentUser?.role === "USER" ? (
                  <UserDashboard />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
             <Route
              path="/kanban"
              element={isAuth ? <KanbanBoard /> : <Navigate to="/" />}
            />
              <Route
              path="/profile"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
              <Route
              path="/settings"
              element={isAuth ? <SettingsPage /> : <Navigate to="/" />}
            />
              <Route
              path="/projects"
              element={isAuth ? <Navigate to="/kanban" /> : <Navigate to="/" />}
            />
            {/*<Route
              path="/chat"
              element={isAuth ? <ProjectChat /> : <Navigate to="/" />}
            />
          
          
           */}
          </Routes>
        )}
      </Router>
    </div>
  );
};

export default AppContent;
