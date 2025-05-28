import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaChair, FaTrash } from 'react-icons/fa';
import './menunext.css';

function Menunext() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialCart = location.state?.cartItems || [];

  const [cartItems, setCartItems] = useState(initialCart);
  const [mode, setMode] = useState('Dine In');
  const [instructions, setInstructions] = useState('');
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [userSaved, setUserSaved] = useState(false);
  const [searchText, setSearchText] = useState('');

  const DELIVERY_TIME_MINUTES = 30;

  const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = mode === 'Take Away' ? 50 : 0;
  const tax = itemTotal * 0.05;
  const grandTotal = itemTotal + delivery + tax;

  const updateQty = (itemName, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.name === itemName
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (itemName) => {
    setCartItems(prev => prev.filter(item => item.name !== itemName));
  };

  const handleSave = () => {
    if (!name || !phone || (mode === 'Take Away' && !address)) {
      alert('Please fill all required fields.');
      return;
    }
    setUserSaved(true);
  };

  // Filter cart items based on search input
  const filteredCartItems = cartItems.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="menunext-container">
      <h2 className="menu-greeting">Good evening</h2>
      <p className="menu-subtext">Place your order here</p>

      <input
        className="menu-search"
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {filteredCartItems.map((item, index) => (
        <div key={index} className="menunext-item">
          <img src={item.image} alt={item.name} className="item-img" />
          <span className="remove-item" onClick={() => removeItem(item.name)}>×</span>
          <div className="item-info">
            <p className="item-name">{item.name}</p>
            <p className="item-price">₹ {item.price}</p>
            <div className="quantity-control">
              <button onClick={() => updateQty(item.name, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQty(item.name, 1)}>+</button>
            </div>
          </div>
        </div>
      ))}

      <div className="cooking-instruction">
        <p onClick={() => setShowInstructionModal(true)} className="instruction-link">
          Add cooking instructions (optional)
        </p>
      </div>

      <div className="mode-toggle">
        <button className={mode === 'Dine In' ? 'active' : ''} onClick={() => setMode('Dine In')}>
          Dine In
        </button>
        <button className={mode === 'Take Away' ? 'active' : ''} onClick={() => setMode('Take Away')}>
          Take Away
        </button>
      </div>

      <div className="price-summary">
        <p>Item Total <span>₹ {itemTotal.toFixed(2)}</span></p>
        {mode === 'Take Away' && <p>Delivery Charge <span>₹ {delivery}</span></p>}
        <p>Taxes (5%) <span>₹ {tax.toFixed(2)}</span></p>
        <hr />
        <p className="grand-total">Grand Total <span>₹ {grandTotal.toFixed(2)}</span></p>
      </div>

      <div className="user-details">
        {!userSaved ? (
          <>
            <input type="text" className='text' placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="tel" className='tel' placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            {mode === 'Take Away' && (
              <input type="text" className="address" placeholder="Delivery Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            )}
            <button className="save-details-btn" onClick={handleSave}>Save</button>
            <p className="mandatory-note">* This field is mandatory. Without this, you can't move further.</p>
          </>
        ) : (
          <div className="user-summary">
            <h4>Your details</h4>
            <p>{name}, {phone}</p>
            <hr />
            {mode === 'Take Away' && (
              <>
                <div className="delivery-info">
                  <FaMapMarkerAlt className="delivery-icon" />
                  <span>Delivery at Home - {address}</span>
                </div>
                <div className="delivery-info">
                  <FaClock className="delivery-icon" />
                  <span>Delivery in <strong>{DELIVERY_TIME_MINUTES} mins</strong></span>
                </div>
                <hr />
              </>
            )}
          </div>
        )}
      </div>

      {userSaved && (
        <div className="swipe-button" onClick={() => navigate('/success')}>
          → Swipe to Order
        </div>
      )}

      {showInstructionModal && (
        <div className="instruction-overlay">
          <div className="instruction-modal-bottom">
            <div className="modal-header">
              <h3 className="modal-title">Add Cooking instructions</h3>
              <span className="modal-close large-close" onClick={() => setShowInstructionModal(false)}>&times;</span>
            </div>

            <div className="modal-area">
              <textarea
                className="modal-textarea"
                placeholder="Type your instructions here..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <p className="note-text">
              The restaurant will try its best to follow your request. However, refunds or cancellations in this regard won’t be possible.
            </p>

            <div className="modal-buttons">
              <button className="cancel-btn" onClick={() => setShowInstructionModal(false)}>Cancel</button>
              <button className="next-btn" onClick={() => setShowInstructionModal(false)}>Save & Continue</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menunext;
