import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './sidebar';
import Dashboard from './Dashboard';
import Tables from './Tables';
import Orderline from './orderline';
import Menu from './menu';

function App() {
  return (
    <Router>
      <Sidebar />
      <div style={{ marginLeft: '70px', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/orderline" element={<Orderline />} />
          <Route path="/menu" element={<Menu />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
