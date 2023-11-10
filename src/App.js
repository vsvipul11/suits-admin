import React from 'react';
import AdminPanel from './AdminPanel';
import UserDetails from './UserDetails';
import './App.css';
import Login from './Login';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";


function App() {
  return (

    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login />} />
        
        <Route path="/admin-panel" element={<AdminPanel />} />    
        <Route path="/user/:userId" element={<UserDetails />} />

  </Routes>
    </BrowserRouter>
      
    </div>
  );
}

export default App;
