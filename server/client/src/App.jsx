import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { VERIFY_USER } from "./utiles/contants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo ,setUserInfo} = useAppStore();
  const verify = async () => {
    try {
      const response = await apiClient.get(VERIFY_USER, { withCredentials: true })
    if (response.status === 200) {
      setUserInfo(response.data)
    }
    } catch (error) {
      console.log(error)
    }
  }
  verify()
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
