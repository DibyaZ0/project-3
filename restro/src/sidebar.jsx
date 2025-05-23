import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './sidebar.css';
import { MdDashboard } from 'react-icons/md';  
import { MdBarChart } from 'react-icons/md'; 

const Sidebar = () => {
  const location = useLocation();

  if (location.pathname === '/menu') return null;

  return (
    <div className="sidebar">
      <div className="logo-container">
      </div>
      <div className="group">
      <NavLink to="/" className={({ isActive }) => isActive ? 'sidebar-button active' : 'sidebar-button'}>
        <MdDashboard size={32} />
      </NavLink>
      <NavLink to="/tables" className={({ isActive }) => isActive ? 'sidebar-button active' : 'sidebar-button'}>
         <svg width="32" height="32" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
         <path d="M7 10h10v2h2v2h-2v4h-2v-4H9v4H7v-4H5v-2h2v-2zm3-6h4v6h-4V4z" />
         </svg>


      </NavLink>
      <NavLink to="/orderline" className={({ isActive }) => isActive ? 'sidebar-button active' : 'sidebar-button'}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6v2H4V2h2v2zm0 2v12h11V6H6zm2 2h7v2H8V8zm0 3h5v2H8v-2z" />
        </svg>

      </NavLink>
      <NavLink to="/menu" className={({ isActive }) => isActive ? 'sidebar-button active' : 'sidebar-button'}>
         <MdBarChart size={32} />
      </NavLink>
    </div>
   </div>
  );
};

export default Sidebar; 