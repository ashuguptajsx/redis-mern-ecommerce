import React, { use } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import AdminPage from "./components/AdminPage"
import CategoryPage from "./components/CategoryPage";
import { useEffect } from "react";



const App = () => {

  const {user, checkAuth} = useUserStore();


  useEffect(()=>{
    checkAuth();
  }
  ,[checkAuth]);
  
  return (
    <div className="relative min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="relative h-full w-full bg-slate-950 [&>div]:absolute [&>div]:inset-0 [&>div]:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
          <div></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-50 pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={!user?<SignupPage />: <Navigate to = "/"/> } />
          <Route path="/login" element={!user?  <LoginPage/> : <Navigate to = "/"/>} />
          <Route path="/dashboard" element={user?.role=="admin" ?  <AdminPage/> : <Navigate to = "/"/>} />
          <Route path="/category/:category" element={<CategoryPage/>} />


        </Routes>
      </div>
      <Toaster/>
    </div>
  );
};

export default App;