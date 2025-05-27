import React, { useEffect, useState } from 'react';
import './Menu.css';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

function Menu() {
  const [data, setData] = useState({});
  const [activeCategory, setActiveCategory] = useState('Pizza');
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = [
    { name: "Pizza", icon: "/pizza-icon.png" },
    { name: "Burger", icon: "/burger-icon.png" },
    { name: "Drink", icon: "/drinks-icon.png" },
    { name: "French Fries", icon: "/frenchfries-icon.png" },
    { name: "Veggies", icon: "/veggies-icon.png" }
  ];

  useEffect(() => {
    fetch('/data/menudata.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Failed to fetch data", err));
  }, []);

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.name === item.name);
      if (exists) {
        return prev.map(i =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.name === item.name);
      if (exists && exists.quantity > 1) {
        return prev.map(i =>
          i.name === item.name ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter(i => i.name !== item.name);
    });
  };

  const goToMenunext = () => {
    navigate('/menunext', { state: { cartItems } });
  };

  const filteredItems = (data[activeCategory] || []).filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="menu-container">
      <h2 className="menu-greeting1">Good evening</h2>
      <p className="menu-subtext1">Place your order here</p>

      <input
        className="menu-find1"
        type="text"
        placeholder="search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="menu-categories">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`category-item ${activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            <img src={cat.icon} alt={cat.name} className="category-icon" />
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      <div className="category-section">
        <h3 className="category-title">{activeCategory}</h3>
        <div className="menu-items">
          {filteredItems.map((item, index) => {
            const cartItem = cartItems.find(i => i.name === item.name);
            return (
              <div className="menu-card" key={index}>
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-price">{item.price}</p>
                </div>
                <div className="quantity-controls">
                  {cartItem?.quantity > 0 ? (
                    <>
                      <button className="qty-btn" onClick={() => handleRemoveFromCart(cartItem)}><FiMinus /></button>
                      <span className="item-quantity">{cartItem.quantity}</span>
                      <button className="qty-btn" onClick={() => handleAddToCart(cartItem)}><FiPlus /></button>
                    </>
                  ) : (
                    <button
                      className="qty-btn"
                      onClick={() => handleAddToCart({
                        name: item.name,
                        price: Number(item.price.replace(/[^\d]/g, '')),
                        image: item.image
                      })}
                    >
                      <FiPlus />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button className="menu-next" onClick={goToMenunext}>Next</button>
    </div>
  );
}

export default Menu;
