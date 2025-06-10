import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const ItemPage = () => {
  const { id } = useParams();  
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState("");

  
  useEffect(() => {
    axios.get(`http://localhost:3001/getitem/${id}`, { withCredentials: true })
      .then(response => {
        if(response.data === "The token was not available") navigate("/login");
        setItem(response.data);
      })
      .catch(err => {
        console.error("Error fetching item:", err);
      });
  }, [id]);

  
  const handleAddToCart = () => {
    axios.post('http://localhost:3001/addtocart', { itemId: id }, { withCredentials: true })
      .then(response => {
        if(response.data === "The token was not available") navigate("/login");
        setMessage("Item added to cart!");
        
      })
      .catch(err => {
        console.error("Error adding item to cart:", err);
        setMessage("Error adding item to cart.");
      });
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '20px' }}>
        <h1>{item.name}</h1>
        <p>Price: {item.price}</p>
        <p>Seller: {item.sellerid}</p>
        
        <p>Description: {item.description || "No description available."}</p>
        <button onClick={handleAddToCart} style={{ padding: '10px 20px', marginTop: '20px' }}>
          Add to Cart
        </button>
        {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      </div>
    </div>
  );
};

export default ItemPage;
