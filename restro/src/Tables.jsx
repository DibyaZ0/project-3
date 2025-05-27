import React, { useState, useEffect } from 'react';
import { FaChair, FaTrash } from 'react-icons/fa';
import './Tables.css';

function Tables() {
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempChairs, setTempChairs] = useState('01');

  useEffect(() => {
    fetch('/data/tablesData.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tables data');
        return res.json();
      })
      .then(data => setTables(data))
      .catch(err => console.error(err));
  }, []);

  const handleCreate = () => {
    setTables([
      ...tables,
      {
        id: Date.now(),
        name: tempName,
        chairs: tempChairs,
      },
    ]);
    setTempName('');
    setTempChairs('01');
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setTables(tables.filter((t) => t.id !== id));
  };

  return (
    <div className="tables-wrapper">
      <div className="top-bar">
        <input className="search-bar1" type="text" placeholder="Search..." />
      </div>

      <div className="tables-card">
        <h1 className="page-title1">Tables</h1>

        <div className="tables-grid">
          {tables.map((table, index) => (
            <div className="table-card" key={table.id}>
              <button
                className="delete-icon"
                onClick={() => handleDelete(table.id)}
                title="Delete"
              >
                <FaTrash />
              </button>
              <div className="table-title">Table</div>
              <div className="table-id">{String(index + 1).padStart(2, '0')}</div>
              <div className="chair-info">
                <FaChair className="chair-icon" /> {table.chairs}
              </div>
            </div>
          ))}

          {!showForm ? (
            <div className="add-box" onClick={() => setShowForm(true)}>
              <span className="plus-icon">+</span>
            </div>
          ) : (
            <div className="form-box">
              <label className="form-label">Table name (optional)</label>
              <input
                type="text"
                className="form-input"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
              />

              <label className="form-label">Chair</label>
              <select
                className="form-select"
                value={tempChairs}
                onChange={(e) => setTempChairs(e.target.value)}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>

              <button className="create-btn" onClick={handleCreate}>
                Create
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tables;
