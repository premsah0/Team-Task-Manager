import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import CreateTask from './pages/CreateTask';

const isAuthenticated = () => {
  return localStorage.getItem('userInfo') !== null;
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

// Layout wrapper that conditionally shows sidebar
const AppLayout = () => {
  const location = useLocation();
  const authPages = ['/login', '/signup'];
  const isAuthPage = authPages.includes(location.pathname);

  return (
    <div className={`min-h-screen ${isAuthPage ? 'bg-slate-900' : 'bg-slate-900 flex'}`}>
      {/* Show sidebar only on authenticated pages */}
      {!isAuthPage && isAuthenticated() && <Sidebar />}

      <main className={`flex-1 ${isAuthPage ? '' : 'ml-64 overflow-y-auto min-h-screen'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/create-project" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
          <Route path="/create-task" element={<PrivateRoute><CreateTask /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
