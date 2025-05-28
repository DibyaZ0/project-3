import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

const COLORS = ['#0088FE', '#FFBB28', '#00C49F'];
const tableCount = 30;
const reservedTables = [2, 5, 7, 9];

function Dashboard() {
  const [orderFilter, setOrderFilter] = useState('Daily');
  const [revenueFilter, setRevenueFilter] = useState('Daily');
  const [tableView, setTableView] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightSection, setHighlightSection] = useState('');

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
    if (searchTerm.trim() === '') {
    setHighlightSection('');
    }
    }, [searchTerm]);

  const isReserved = (tableNo) => reservedTables.includes(tableNo);
  const orderSummaryData = [
    { label: 'Served', value: 10 },
    { label: 'Dine In', value: 20 },
    { label: 'Take Away', value: 30 },
  ];

  const revenueData = [
    { label: 'Mon', value: 200 },
    { label: 'Tue', value: 5 },
    { label: 'Wed', value: 10 },
    { label: 'Thu', value: 20 },
    { label: 'Fri', value: 10 },
    { label: 'Sat', value: 40 },
    { label: 'Sun', value: 30 },
  ];
   
  const handleSectionFocus = (section) => {
    setHighlightSection(section);
    setShowDropdown(false);
  };
  return (
    <div className="dashboard-wrapper">
      <div className="top-bar">
        <div className="filter-search" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Filter..."
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div
            className="dropdown-icon-clickable"
            onClick={() => setShowDropdown(prev => !prev)}
          >
            <svg height="16" viewBox="0 0 512 512" width="16">
              <path
                d="M98 190l158 158 158-158"
                fill="none"
                stroke="#999"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="48"
              />
            </svg>
          </div>
          {showDropdown && (
            <ul className="dropdown-options">
              {['order Summary', 'Revenue', 'Tables', 'chef-list','card'].map(option => (
                <li
                  key={option}
                  onClick={() => {
                    setSearchTerm(option);
                    setHighlightSection(option);
                    setShowDropdown(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

        <div className="dashboard-wrapper-2">
        <h2 className="dashboard-heading">Analytics</h2>

        <div className={`card-grid ${highlightSection && highlightSection !== 'card' ? 'blurred' : ''}`}>
          <div className="card1">
          <img src="./Image.png" alt="Chef Icon" className="card-image" />
          <div className="card-content">
              <p>04</p>
              <p>TOTAL CHEF</p>
            </div>
          </div>
          <div className="card">
            <img src="./imagee.png" alt="Revenue Icon" className="card-image" />
            <div className="card-content">
              <p>00</p>
              <p>TOTAL REVENUE</p>
            </div>
          </div>
          <div className="card">
            <img src="./Image 1.png" alt="Orders Icon" className="card-image" />
            <div className="card-content">
              <p>00</p>
              <p>TOTAL ORDERS</p>
            </div>
          </div>
          <div className="card">
            <img src="./Image 2.png" alt="Clients Icon" className="card-image" />
            <div className="card-content">
              <p>00</p>
              <p>TOTAL ORDERS</p>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div id="order Summary" className={`order-summary ${highlightSection && highlightSection !== 'order Summary' ? 'blurred' : ''}`}>
            <div className="section-header">
              <h4>Order Summary</h4>
              <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)}>
                {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className= "summary-main">
            <div className="summary-cards">
              {orderSummaryData.map((item, index) => (
                <div key={item.label} className="summary-card-box">
                  <p className="summary-value">{item.value}</p>
                  <p className="summary-label">{item.label}</p>
                </div>
              ))}
            </div>
            <PieChart width={250} height={200}>
              <Pie
                data={orderSummaryData}
                dataKey="value"
                nameKey="label"
                outerRadius={70}
                label
              >
                {orderSummaryData.map((entry, index) => (
                  <Cell key={entry.label} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart> 
            </div>
          </div>
          
          <div id="Revenue" className={`revenue-section ${highlightSection && highlightSection !== 'Revenue' ? 'blurred' : ''}`}>
            <div className="section-header">
              <h4>Revenue</h4>
              <select value={revenueFilter} onChange={(e) => setRevenueFilter(e.target.value)}>
                {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(opt => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="revenue-chart">
              {revenueData.map(day => (
                <div key={day.label} className="bar">
                  <div className="bar-fill" style={{ height: `${day.value * 2}px` }}></div>
                  <div className="bar-label">{day.label}</div>
                </div>
              ))}
            </div>
          </div>
      
        <div id="Tables" className={`table-section ${highlightSection && highlightSection !== 'Tables' ? 'blurred' : ''}`}>
        <div className="section-header table-header">
        <div className="table-header-title">Tables</div>
        <div className="table-legend">
        <div className="legend-box available"></div><span>Available</span>
        <div className="legend-box reserved"></div><span>Reserved</span>
        </div>
      </div>
      <div className="tables-grid">
      {Array.from({ length: tableCount }, (_, i) => i + 1).map((num) => {
      const reserved = isReserved(num);
        return (
        <div
        key={num}
        className="table-box"
        style={{
            backgroundColor: reserved ? 'lightgreen' : 'white',
            border: reserved ? '2px solid green' : '1px solid #ccc',
        }}
        >
        Table {num.toString().padStart(2, '0')}
        </div>
         ) 
        })}
       </div>
       </div>
      </div>
      
        <div id="chef-list" className={`chef-list ${highlightSection && highlightSection !== 'chef-list' ? 'blurred' : ''}`}>
          <div className="chef-header">
            <h3>Chef Name</h3>
            <h3 className="order-label">Order Taken</h3>
          </div>
          <ul>
            <li><span className="chef-name">Manesh</span><span className="order-count">00</span></li><hr />
            <li><span className="chef-name">Pritam</span><span className="order-count">00</span></li><hr />
            <li><span className="chef-name">Yash</span><span className="order-count">00</span></li><hr />
            <li><span className="chef-name">Tenzen</span><span className="order-count">00</span></li><hr />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;