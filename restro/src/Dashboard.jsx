import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";
import {
  getAnalytics,
  getAnalyticsSummary,
  getChefs,
  getTables,
  getOrderSummary,
} from "./api";

const COLORS = ["#C4C4C4", "#9c9c9c", "#686666"];
const tableCount = 30;
const reservedTables = [2, 5, 7, 9];

function Dashboard() {
  const [orderFilter, setOrderFilter] = useState("Daily");
  const [revenueFilter, setRevenueFilter] = useState("Daily");
  const [tableView, setTableView] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightSection, setHighlightSection] = useState("");
  const [chefs, setChefs] = useState([]);
  const [tables, setTables] = useState([]);

  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
    totalChefs: 0,
  });

  const [revenueData, setRevenueData] = useState([]);
  const [orderSummaryData, setOrderSummaryData] = useState([]);

  const dropdownRef = useRef(null);

  const beautifyNumber = (num) => {
    if (num instanceof Number) {
      if (num < 10) return "0" + num.toString();
    }
    if (num instanceof String) {
      return num.length < 2 ? "0" + num : num;
    }

    return num;
  };

  useEffect(() => {
    async function getchefsLocal() {
      const res = await getChefs();
      const tabeldata = await getTables();
      const analyticsData = await getAnalytics();
      const res2 = await getOrderSummary({ orderFilter });
      setOrderSummaryData(res2);
      console.log(res2);
      setChefs(res);
      setAnalytics({
        totalChefs: analyticsData?.totalChefs,
        totalClients: analyticsData?.totalClients,
        totalOrders: analyticsData?.totalOrders,
        totalRevenue: analyticsData?.totalRevenue,
      });
      setTables(tabeldata);
    }
    getchefsLocal();
  }, []);

  useEffect(() => {
    async function getAnalyticsSummaryData() {
      const res = await getAnalyticsSummary({ revenueFilter });
      setRevenueData(res);
    }
    getAnalyticsSummaryData();
  }, [revenueFilter]);

  useEffect(() => {
    async function getOrderSummaryData() {
      const res = await getOrderSummary({ orderFilter });
      setOrderSummaryData(res);
      console.log(res);
    }
    getOrderSummaryData();
  }, [orderFilter]);

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
    if (searchTerm.trim() === "") {
      setHighlightSection("");
    }
  }, [searchTerm]);

  const isReserved = (tableNo) => reservedTables.includes(tableNo);

  const handleSectionFocus = (section) => {
    setHighlightSection(section);
    setShowDropdown(false);
  };

  const totalOrders = useMemo(() => {
  return orderSummaryData.reduce((acc, item) => acc + item.totalOrders, 0);
}, [orderSummaryData]);
console.log("Total Orders:", totalOrders);

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
            onClick={() => setShowDropdown((prev) => !prev)}
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
              {["order Summary", "Revenue", "Tables", "chef-list", "card"].map(
                (option) => (
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
                )
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="dashboard-wrapper-2">
        <h2 className="dashboard-heading">Analytics</h2>

        <div
          className={`card-grid ${
            highlightSection && highlightSection !== "card" ? "blurred" : ""
          }`}
        >
          <div className="card">
            <div className="card-image">
              <img src="./Image.png" alt="Chef Icon"/>
            </div>
            <div className="card-content">
              <p>{beautifyNumber(analytics.totalChefs)}</p>
              <p>TOTAL CHEF</p>
            </div>
          </div>
          <div className="card">
            <div className="card-image">
              <img
                src="./imagee.png"
                alt="Revenue Icon"
              />
            </div>
            <div className="card-content">
              <p>{beautifyNumber(analytics.totalRevenue)}</p>
              <p>TOTAL REVENUE</p>
            </div>
          </div>
          <div className="card">
            <div className="card-image">
              <img
                src="./Image 1.png"
                alt="Orders Icon"
              />
            </div>
            <div className="card-content">
              <p>{beautifyNumber(analytics.totalOrders)}</p>
              <p>TOTAL ORDERS</p>
            </div>
          </div>
          <div className="card">
            <div className="card-image">
              <img
                src="./Image 2.png"
                alt="Clients Icon"
              />
            </div>
            <div className="card-content">
              <p>{beautifyNumber(analytics.totalClients)}</p>
              <p>TOTAL CLIENT</p>
            </div>
          </div>
        </div>

        <div className="main-grid">
          <div
            id="order Summary"
            className={`order-summary ${
              highlightSection && highlightSection !== "order Summary"
                ? "blurred"
                : ""
            }`}
          >
            <div className="section-header">
              <h4>Order Summary</h4>
              <select
                className="header-part"
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
              >
                {["Daily", "Weekly", "Monthly", "Yearly"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="summary-main">
              <div className="summary-cards">
                {orderSummaryData.map((item, index) => (
                  <div key={item.mode} className="summary-card-box">
                    <p className="summary-value">
                      {beautifyNumber(item.totalOrders)}
                    </p>
                    <p className="summary-label">{item.mode}</p>
                  </div>
                ))}
              </div>
               <div className="summary-chart-section">
  <div className="summary-pie">
    <PieChart width={100} height={100}>
      <Pie
        data={orderSummaryData}
        dataKey="totalOrders"
        nameKey="mode"
        innerRadius={30}
        outerRadius={40}
        paddingAngle={2}
      >
        {orderSummaryData.map((entry, index) => (
          <Cell key={entry.mode} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  </div>

  <div className="summary-bars">
    {orderSummaryData.map((item, index) => {
      const percent = totalOrders
        ? Math.round((item.totalOrders / totalOrders) * 100)
        : 0;
      return (
        <div key={item.mode} className="summary-bar-row">
          <span className="bar-label">{item.mode}</span>
          <span className="bar-percent">({percent}%)</span>
          <div className="bar-container">
            <div
              className="bar-fill"
              style={{
                width: `${percent}%`,
                backgroundColor: COLORS[index % COLORS.length],
              }}
            ></div>
          </div>
        </div>
      );
    })}
  </div>
</div>

            </div>
          </div>

          <div
            id="Revenue"
            className={`revenue-section ${
              highlightSection && highlightSection !== "Revenue"
                ? "blurred"
                : ""
            }`}
          >
            <div className="section-header">
              <h4>Revenue</h4>
              <select
                className="header-part"
                value={revenueFilter}
                onChange={(e) => setRevenueFilter(e.target.value)}
              >
                {["Daily", "Weekly", "Monthly", "Yearly"].map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weekday" />
                <YAxis hide={true} />
                <Bar dataKey="totalRevenue" fill="#d1d1d1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            id="Tables"
            className={`table-section ${
              highlightSection && highlightSection !== "Tables" ? "blurred" : ""
            }`}
          >
            <div className="section-header table-header">
              <div className="table-header-title">Tables</div>
              <div className="table-legend">
                <div className="table-legend-item">
                  <div className="legend-box reserved"></div>
                  <span>Reserved</span>
                </div>
                <div className="table-legend-item">
                  <div className="legend-box available"></div>
                  <span>Available</span>
                </div>
              </div>
            </div>
            <div className="tables-grid">
              {tables.map((table) => {
                const reserved = table?.tablestatus?.length > 0;
                return (
                  <div
                    key={table?._id}
                    className="table-box"
                    style={{
                      backgroundColor: reserved ? "lightgreen" : "white",
                      border: reserved ? "2px solid green" : "1px solid #ccc",
                    }}
                  >
                    Table {table?.no?.toString().padStart(2, "0")}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          id="chef-list"
          className={`chef-list ${
            highlightSection && highlightSection !== "chef-list"
              ? "blurred"
              : ""
          }`}
        >
          <div className="chef-header">
            <h3>Chef Name</h3>
            <h3 className="order-label">Order Taken</h3>
          </div>
          <ul>
            {chefs.map((ele) => {
              return (
                <>
                  <li key={ele?._id}>
                    <span className="chef-name">{ele?.name}</span>
                    <span className="order-count">{ele?.orderCount}</span>
                  </li>
                  <hr />
                </>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
