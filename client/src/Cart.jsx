import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const MyCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [orderMessage, setOrderMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/mycart", { withCredentials: true })
      .then(response => {
        if(response.data === "The token was not available") navigate("/login");
        const items = response.data.cartItems;
        setCartItems(items);
        const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
        setTotalCost(total);
      })
      .catch(err => {
        console.error("Error fetching cart items:", err);
      });
  }, []);

  const handleRemove = (itemId) => {
    axios.post("http://localhost:3001/removecartitem", { itemId }, { withCredentials: true })
      .then(response => {
        if(response.data === "The token was not available") navigate("/login");
        const updatedCart = response.data.cartItems;
        setCartItems(updatedCart);
        const total = updatedCart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        setTotalCost(total);
      })
      .catch(err => {
        console.error("Error removing item:", err);
      });
  };

  
  const handleFinalOrder = () => {
    axios.post("http://localhost:3001/finalizeorder", {}, { withCredentials: true })
      .then(response => {
        if(response.data === "The token was not available") navigate("/login");
        else if(response.data.success){
          setOrderMessage("Order placed successfully!");
          setCartItems([]);
          setTotalCost(0);
        } else {
          setOrderMessage("Order failed. Please try again.");
        }
      })
      .catch(err => {
        console.error("Error finalizing order:", err);
        setOrderMessage("Order failed. Please try again.");
      });
  };

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '20px' }}>
        <h2>My Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
            {cartItems.map((item, index) => (
            <li key={`${item._id}-${index}`} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
                <span style={{ fontWeight: 'bold' }}>{item.name}</span> - ${item.price}
                <button 
                onClick={() => handleRemove(item._id)}
                style={{ marginLeft: '15px', padding: '5px 10px' }}
                >
                Remove
                </button>
            </li>
            ))}
            </ul>
            <h4>Total: ${totalCost.toFixed(2)}</h4>
            <button 
              onClick={handleFinalOrder}
              style={{ padding: '10px 20px', marginTop: '20px' }}
            >
              Final Order
            </button>
            {orderMessage && <p style={{ marginTop: '10px' }}>{orderMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCart;
