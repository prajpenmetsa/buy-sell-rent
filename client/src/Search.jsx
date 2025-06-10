import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  
  useEffect(() => {
    axios.get("http://localhost:3001/getitems", { withCredentials: true })
      .then(response => {
        if(response.data === "The token was not available") navigate("/login");
        console.log("Fetched items:", response.data); 
        setItems(response.data);
        const categoriesSet = new Set();
        response.data.forEach(item => {
          if(item.category) {  
            item.category.forEach(cat => categoriesSet.add(cat));
          }
        });
        const categoriesArray = Array.from(categoriesSet);
        console.log("Derived categories:", categoriesArray);
        setAllCategories(categoriesArray);
      })
      .catch(err => {
        console.error("Error fetching items:", err);
      });
  }, []);
  

  
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    if (e.target.checked) {
      setSelectedCategories(prev => [...prev, category]);
      filteredItems();
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
      filteredItems();
    }
  };

  // Filter items based on search text and selected categories
  const filteredItems = items.filter(item => {
    const matchesSearch = searchText === "" || item.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || item.category.some(cat => selectedCategories.includes(cat));
    return matchesSearch && matchesCategory;
  });  

  return (
    <div>
      <Navbar />
      <div className="container" style={{ padding: '20px' }}>
        <h3>Search Items</h3>
        
        <div className="search-bar" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search for items..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '100%', padding: '10px', fontSize: '16px' }}
          />
        </div>
        
        <div className="filters" style={{ marginBottom: '20px' }}>
        <h5>Filter by Categories:</h5>
        {allCategories.map((category, index) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <button
              key={index}
              onClick={() => {
                if (isSelected) {
                  setSelectedCategories(selectedCategories.filter(c => c !== category));
                } else {
                  setSelectedCategories([...selectedCategories, category]);
                }
              }}
              style={{
                margin: '5px',
                padding: '8px 12px',
                backgroundColor: isSelected ? '#007bff' : '#f0f0f0',
                color: isSelected ? '#fff' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {category}
            </button>            
            );
        })}
        </div>

        
        <div className="items-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {filteredItems.map(item => (
            <Link
            key={item._id}
            to={`/item/${item._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
            >
            <div
                className="item-card"
                style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                width: 'fit-content',  
                minWidth: '200px',      
                maxWidth: '300px',     
                }}
            >
                <h5>{item.name}</h5>
                <p>Price: {item.price}</p>
                <p>Seller: {item.sellerid}</p>
                <p>Categories: {item.category.join(" ,")}</p>
            </div>
            </Link>
        ))}
        </div>

      </div>
    </div>
  );
};

export default SearchItems;
