import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Transactions from './components/Transactions/Transactions';
import Budgets from './components/Budgets/Budgets';
import Analytics from './components/Analytics/Analytics';
import Navbar from './components/Layout/Navbar';
import LandingPage from './components/LandingPage/LandingPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={
        user ? <><Navbar /><div className="container"><Dashboard /></div></> : <Navigate to="/login" />
      } />
      <Route path="/transactions" element={
        user ? <><Navbar /><div className="container"><Transactions /></div></> : <Navigate to="/login" />
      } />
      <Route path="/budgets" element={
        user ? <><Navbar /><div className="container"><Budgets /></div></> : <Navigate to="/login" />
      } />
      <Route path="/analytics" element={
        user ? <><Navbar /><div className="container"><Analytics /></div></> : <Navigate to="/login" />
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;