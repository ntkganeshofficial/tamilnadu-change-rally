import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import Index from './pages/Index';
import Election2016 from './pages/Election2016';
import FieldWork from './pages/FieldWork';
import CandidateProfile from './pages/CandidateProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import './App.css';

function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Header 
        userName={user?.displayName || 'பயனர்'} 
        onLogout={user ? handleLogout : undefined}
      />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/election-2016" element={<Election2016 />} />
        <Route path="/candidate-profile" element={<CandidateProfile />} />
        <Route path="/field-work" element={<FieldWork />} />
      </Routes>
    </Router>
  );
}

export default App;
