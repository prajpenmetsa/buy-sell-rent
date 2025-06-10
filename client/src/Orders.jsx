import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const OrdersHistory = () => {
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('buyer');
  const navigate = useNavigate();

  useEffect(() => {
    
    axios.get("http://localhost:3001/orders/buyer", { withCredentials: true })
      .then(response => {
        if (response.data === "The token was not available") navigate("/login");
        setBuyerOrders(response.data.orders);
      })
      .catch(err => console.error("Error fetching buyer orders:", err));
    
    
    axios.get("http://localhost:3001/orders/seller", { withCredentials: true })
      .then(response => {
        setSellerOrders(response.data.orders);
      })
      .catch(err => console.error("Error fetching seller orders:", err));
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '20px' }}>
        <h2>Orders History</h2>
        
        
        <div style={{ marginBottom: '20px' }}>
          <button 
            onClick={() => setActiveTab('buyer')} 
            style={{ 
              padding: '10px 20px', 
              marginRight: '10px',
              backgroundColor: activeTab === 'buyer' ? '#a2d2ff' : '#ccc',
              color: activeTab === 'buyer' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Orders Placed
          </button>
          <button 
            onClick={() => setActiveTab('seller')} 
            style={{ 
              padding: '10px 20px', 
              backgroundColor: activeTab === 'seller' ? '#a2d2ff' : '#ccc',
              color: activeTab === 'seller' ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Items Sold
          </button>
        </div>

        
        {activeTab === 'buyer' && (
          <div>
            <h3>Orders Placed</h3>
            {buyerOrders.length === 0 ? (
              <p>No orders placed.</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {buyerOrders.map(order => (
                  <li key={order._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <p><strong>Item:</strong> {order.item.name}</p>
                    <p><strong>Price:</strong> ${order.item.price}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>OTP:</strong> {order.plainOTP}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'seller' && (
          <div>
            <h3>Items Sold</h3>
            {sellerOrders.length === 0 ? (
              <p>No items sold.</p>
            ) : (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {sellerOrders.map(order => (
                  <li key={order._id} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <p><strong>Item:</strong> {order.item.name}</p>
                    <p><strong>Price:</strong> ${order.item.price}</p>
                    <p><strong>Buyer:</strong> {order.buyerEmail}</p>
                    <p><strong>Status:</strong> {order.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersHistory;