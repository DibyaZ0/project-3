import React, { useEffect, useState } from 'react';
import './Orderline.css';

function Orderline() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/data/orders.json')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error loading orders:', err));
  }, []);

  const getStatusColor = (type) => {
    switch (type) {
      case 'Served':
        return '#B9F8C9';
      case 'Take Away':
        return '#C2D4D9';
      case 'Dine In':
        return '#FFE3BC';
      default:
        return '#ffffff';
    }
  };

  const getStatusText = (type) => {
    return type === 'Served' ? 'Done' : 'Processing';
  };

  return (
    <div className="orderline-container">
      {orders.map((order, index) => (
        <div
          className="order-card"
          key={index}
          style={{ backgroundColor: getStatusColor(order.orderType) }}
        >
          {/* Top section */}
          <div className="order-top">
            <div className="order-info-left">
              <img
                src="./Vector.png"
                alt="icon"
                className="order-icon"
              />
              <div>
                <div className="order-id">#{order.orderId}</div>
                <div className="order-table">Table-{order.tableNo}</div>
                <div className="order-time">{order.time}</div>
                <div className="order-items">{order.items.length} Item</div>
              </div>
            </div>
            <div className="order-info-right">
              <div className="order-type-box" style={{ backgroundColor: getStatusColor(order.orderType) }}>
                <div className="order-type">{order.orderType}</div>
                <div className="order-eta">Ongoing: 4 Min</div>
              </div>
            </div>
          </div>

          {/* Middle section */}
          <div className="order-middle">
            <div>1 x Value Set Meals</div>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="order-footer-status">
            {getStatusText(order.orderType)}
            {getStatusText(order.orderType) === 'Processing' && (
              <span className="order-hourglass"> ⏳</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orderline;
