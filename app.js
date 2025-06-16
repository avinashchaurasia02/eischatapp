import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Dashboard from './components/Dashboard';
import Chatbot from './components/ChatBot';
import Login from './components/Login';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatbotMinimized, setChatbotMinimized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState('');

  // Check for existing login session on app load
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedLoginTime = localStorage.getItem('loginTime');
    if (storedUsername && storedLoginTime) {
      // Check if session has expired
      const loginTime = parseInt(storedLoginTime, 10);
      if (loginTime && Date.now() - loginTime < 60 * 60 * 1000) {
        setUsername(storedUsername);
        setIsLoggedIn(true);
      } else {
        handleLogout();
      }
    }
  }, []);

  // Set login timestamp on login
  const handleLogin = (user) => {
    const now = Date.now();
    setUsername(user);
    setIsLoggedIn(true);
    localStorage.setItem('username', user);
    localStorage.setItem('loginTime', now.toString());
    sessionStorage.setItem('loginTime', now.toString());
  };

  // Logout and flush session storage
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    localStorage.removeItem('username');
    localStorage.removeItem('loginTime');
    sessionStorage.clear(); // Flush entire session storage
  };

  // Auto logout after 1 hour
  useEffect(() => {
    if (!isLoggedIn) return;

    const checkAutoLogout = () => {
      const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
      if (loginTime && Date.now() - loginTime > 60 * 60 * 1000) {
        handleLogout();
      }
    };

    const interval = setInterval(checkAutoLogout, 60 * 1000); // Check every minute
    checkAutoLogout();

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
    const clearCache = () => {
      if ('caches' in window) {
        caches.keys().then((names) => {
          for (let name of names) {
            caches.delete(name);
          }
        });
      }
    };
    clearCache();
  }, []);

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        username={username}
        onLogout={handleLogout}
      />
      {!chatbotMinimized && <div className="app-background" />}
      <div className={`main ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
        <Menu
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Dashboard isSidebarOpen={isSidebarOpen} />
        <Chatbot setChatbotMinimized={setChatbotMinimized} username={username} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
