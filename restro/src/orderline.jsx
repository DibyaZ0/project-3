'use client'
import React, { useEffect, useState } from 'react';
import './Orderline.css';
import { getOrders, updateOrder } from './api';

function Orderline() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [timeNow, setTimeNow] = useState(new Date());
  const [pickupStatus, setPickupStatus] = useState({});
  const [AnyOrderComplete,setAnyOrderComplete]= useState(null);
  useEffect(() => {
    const completedOrder = orders.find(order => 
      order.mode === 'Dine In' &&
      order.durationMin &&
      order.status !=='Done' &&
      getElapsedMinutes(order.createdAt) >= order.durationMin
    );
    if (completedOrder) {
      updateOrder(completedOrder._id);
      setOrders(prev =>
        prev.map(o =>
          o._id === completedOrder._id ? { ...o, status: 'Done' } : o
        )
      );
    }
  }, [orders]);



  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
        const initialStatus = {};
        data.forEach((order) => {
          if (order.mode === 'Take Away') {
            initialStatus[order.orderId] = 'Not Picked Up';
          }
        });
        setPickupStatus(initialStatus);
      })
      .catch((err) => console.error('Error loading orders:', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getElapsedMinutes = (startTime) => {
    const start = new Date(startTime);
    return Math.floor((timeNow - start) / 60000);
  };

  const getStatusColor = (mode, pickedUpStatus, isDone) => {
    if (mode === 'Take Away') {
      if (pickedUpStatus === 'Picked Up' && isDone) return '#B9F8C9'; 
      return '#C2D4D9'; 
    }
    if (isDone) return '#B9F8C9'; 
    if (mode === 'Dine In') return '#FFE3BC'; 
    return '#ffffff';
  };

  const filteredOrders = orders.filter(order =>
  (order.orderId || "").includes(search) ||
  (order.tableNo || "").includes(search) ||
  (order.orderType || "").toLowerCase().includes(search.toLowerCase())
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
          {filteredOrders.map( (order, index) => {
            const isTakeAway = order.mode === 'Take Away';
            const hasTimer = order.createdAt && order.durationMin;
            const elapsed = getElapsedMinutes(order.createdAt);
            const isDone = order.durationMin && elapsed >= order.durationMin;
            const pickedUpStatus = pickupStatus[order.orderId] || 'Not Picked Up';

            let currentType = order.mode;
            let currentStatus = 'Processing';

            if (order.mode === 'Take Away' && isDone) {
              currentType = 'Done';
              currentStatus = 'Order Done';
            } else if (order.mode === 'Dine In' && isDone) {
              currentType = 'Done';
              currentStatus = 'Order Done';
              // setAnyOrderComplete(order); 
            }

            let footerClass = '';
            if (currentStatus === 'Order Done') {
              if (order.mode === 'Take Away') {
                footerClass = pickedUpStatus === 'Picked Up' ? 'footer-served' : 'footer-takeaway';
              } else if (order.mode === 'Dine In') {
                footerClass = 'footer-served';
              }
            } else {
              footerClass = order.mode === 'Take Away' ? 'footer-takeaway' : order.mode === 'Dine In' ? 'footer-dinein' : '';
            }

            return (
              <div
                className="order-card"
                key={index}
                style={{
                  backgroundColor: getStatusColor(order.mode, pickedUpStatus, isDone)
                }}
              >
                <div className="order-top">
                  <div className="order-info-left">
                    <img src="/Vector.png" alt="icon" className="order-icon" />
                    <div>
                      <div className="order-id">#{order.orderId}</div>
                      <div className="order-table">Table-{order?.tableNo}</div>
                      <div className="order-time">
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="order-items">
                        {order.items.length} Item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="order-info-right">
                    <div
                      className="order-type-box"
                      style={{
                        backgroundColor: getStatusColor(order.mode, pickedUpStatus, isDone)
                      }}
                    >
                      <div className="order-type">{currentType}</div>
                      <div className="order-eta">
                        {order.mode === 'Take Away' ? (
                          elapsed < 30 ? (
                            `Ongoing: ${elapsed} Min`
                          ) : (
                            <>
                              {pickedUpStatus}
                              <select
                                className="pickup-dropdown"
                                value={pickedUpStatus}
                                onChange={(e) =>
                                  setPickupStatus((prev) => ({
                                    ...prev,
                                    [order.orderId]: e.target.value
                                  }))
                                }
                              >
                                <option value="Not Picked Up">Not Picked Up</option>
                                <option value="Picked Up">Picked Up</option>
                              </select>
                            </>
                          )
                        ) : currentType !== 'Done' ? (
                          `Ongoing: ${elapsed} Min`
                        ) : (
                          'Served'
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="order-middle">
                  <ul className="order-items-list">
                    <h3 className='lucky'>1 x value set values</h3>
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.quantity} x {item.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`order-footer-status ${footerClass}`}>
                  {currentStatus === 'Order Done' ? (
                    <span className="order-check">Order Done ✓</span>
                  ) : (
                    <span className="order-hourglass">Processing ⏳</span>
                  )}
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
