import React, { useEffect, useState } from 'react';
import './Orderline.css';

function Orderline() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [timeNow, setTimeNow] = useState(new Date());

  useEffect(() => {
    fetch('/data/orders.json')
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Error loading orders:', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date());
    }, 30000);

    return () => clearInterval(interval);
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

  const getElapsedMinutes = (startTime) => {
    const start = new Date(startTime);
    return Math.floor((timeNow - start) / 60000);
  };

  const filteredOrders = orders.filter(order =>
    order.orderId.includes(search) ||
    order.tableNo.includes(search) ||
    order.orderType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="orderline-page-wrapper">
      <div className="orderline-header">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by order ID or order type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="orderline-content-card">
        <h2 className="orderline-title">Order Line</h2>
        <div className="orderline-container">
          {filteredOrders.map((order, index) => {
            const isTakeAway = order.orderType === 'Take Away';
            const hasTimer = order.startTime && order.durationMin;
            const elapsed = hasTimer ? getElapsedMinutes(order.startTime) : 0;
            const isDone = hasTimer && elapsed >= order.durationMin;

            const currentType = isDone ? 'Served' : order.orderType;
            const currentStatus = isDone || order.orderType === 'Served'
              ? 'Order Done'
              : 'Processing';

            return (
              <div
                className="order-card"
                key={index}
                style={{ backgroundColor: getStatusColor(currentType) }}
              >
                <div className="order-top">
                  <div className="order-info-left">
                    <img src="/Vector.png" alt="icon" className="order-icon" />
                    <div>
                      <div className="order-id">#{order.orderId}</div>
                      <div className="order-table">Table-{order.tableNo}</div>
                      <div className="order-time">{order.time}</div>
                      <div className="order-items">{order.items.length} Item</div>
                    </div>
                  </div>
                  <div className="order-info-right">
                    <div className="order-type-box" style={{ backgroundColor: getStatusColor(currentType) }}>
                      <div className="order-type">{currentType}</div>
                      <div className="order-eta">
                        {isTakeAway
                          ? order.statusDetail
                          : isDone
                          ? 'order completed'
                          : `Ongoing: ${elapsed} Min`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-middle">
                  <div>1 x Value Set Meals</div>
                  <ul className="order-items-list">
                    {order.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div
                  className={`order-footer-status ${
                     currentType === 'Served'
                      ? 'footer-served'
                      : currentType === 'Take Away'
                      ? 'footer-takeaway'
                      : currentType === 'Dine In'
                      ? 'footer-dinein'
                      : ''
                      }`}
                >
                  {currentStatus}
                  {currentStatus === 'Order Done' && <span className="order-check">✓</span>}
                  {currentStatus === 'Processing' && <span className="order-hourglass">⏳</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Orderline;
