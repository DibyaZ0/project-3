import React, { useState, useEffect } from 'react';
import { FaChair, FaTrash } from 'react-icons/fa';
import { getTables, createTable, deleteTable } from './api';
import './Tables.css';

function Tables() {
  const [tables, setTables] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempChairs, setTempChairs] = useState('01');
  const [searchTable, setSearchTable] = useState('');

  useEffect(() => {
    getTables()
      .then(data => setTables(data))
      .catch(err => console.error('Error fetching tables:', err));
  }, []);

  const handleCreate = async () => {
    const newTable = {
      name: tempName,
      chairs: tempChairs
    };
    const saved = await createTable(newTable);
    if (saved && saved._id) {
      setTables([...tables, saved]);
    }
    setTempName('');
    setTempChairs('03');
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    const result = await deleteTable(id);
    if (result.message === 'Record deleted successfully') {
      setTables(tables.filter((t) => t._id !== id));
    }else {
      alert('Failed to delete table. Please try again.');
    }
  };

  const filteredIndexes = tables.reduce((acc, table, i) => {
    const tableNumber = String(i + 1).padStart(2, '0');
    const name = table.name?.toLowerCase() || '';
    const search = searchTable.toLowerCase();
    if (tableNumber.includes(search) || name.includes(search)) {
      acc.push(i);
    }
    return acc;
  }, []);

  return (
    <div className="tables-wrapper">
      <div className="top-bar">
        <input
          className="search-bar1"
          type="text"
          placeholder="Search..."
          value={searchTable}
          onChange={(e) => setSearchTable(e.target.value)}
        />
      </div>

      <div className="tables-card">
        <h1 className="page-title1">Tables</h1>

        <div className="tables-grid">
          {filteredIndexes.map((i) => {
            const table = tables[i];
            const tableNumber = String(i + 1).padStart(2, '0');

            return (
              <div className="table-card" key={table._id}>
                <button
                  className="delete-icon"
                  onClick={() => handleDelete(table._id)}
                  title="Delete"
                >
                  <FaTrash />
                </button>
                <div className="table-title">Table</div>
                <div className="table-id">{tableNumber}</div>
                <div className="chair-info">
                  <FaChair className="chair-icon" /> {table.chairs}
                </div>
              </div>
            );
          })}

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
                {[...Array(6)].map((_, i) => (
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
