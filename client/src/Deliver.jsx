import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const DeliverItems = () => {
  const [orders, setOrders] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});

  useEffect(() => {
    axios.get("http://localhost:3001/orders/seller", { withCredentials: true })
      .then(response => {
        if(response.data === "The token was not available") navigate("/login");
        setOrders(response.data.orders);
      })
      .catch(err => console.error("Error fetching orders for seller:", err));
  }, []);

  const handleOtpChange = (orderId, value) => {
    setOtpInputs({ ...otpInputs, [orderId]: value });
  };

  const handleCloseOrder = (orderId) => {
    const otp = otpInputs[orderId];
    axios.post("http://localhost:3001/closeorder", { orderId, otp }, { withCredentials: true })
      .then(response => {
        if(response.data === "The token was not available") navigate("/login");
        
        setOrders(orders.map(order => {
          if (order._id === orderId) {
            return { ...order, status: "completed" };
          }
          return order;
        }));
        alert(response.data.message);
      })
      .catch(err => {
        console.error("Error closing order:", err);
        alert(err.response.data.error || "Error closing order");
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '20px' }}>
        <h2>Deliver Items</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {orders.map(order => (
              <li key={order._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                <p><strong>Item:</strong> {order.item.name}</p>
                <p><strong>Buyer:</strong> {order.buyerEmail}</p>
                <p><strong>Status:</strong> {order.status}</p>
                {order.status !== "completed" && (
                  <div>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otpInputs[order._id] || ""}
                      onChange={(e) => handleOtpChange(order._id, e.target.value)}
                    />
                    <button onClick={() => handleCloseOrder(order._id)} style={{ marginLeft: '10px' }}>
                      Close Order
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DeliverItems;
