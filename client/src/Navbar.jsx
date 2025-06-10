import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post("http://localhost:3001/logout", {}, { withCredentials: true })
      .then(response => {
        
        navigate("/login");
      })
      .catch(err => {
        console.error("Logout error:", err);
      });
  };

  return (
    <nav className="navbar" style={styles.navbar}>
      <div className="navbar-logo" style={styles.logo}>
        <Link to="/profile" style={styles.link}>
          <h2>Buy Sell Rent</h2>
        </Link>
      </div>
      <ul className="navbar-links" style={styles.navLinks}>
        <li style={styles.navItem}>
          <Link to="/search" style={styles.link}>
            Search Items
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/orders-history" style={styles.link}>
            Orders History
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/deliveritems" style={styles.link}>
            Deliver Items
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/mycart" style={styles.link}>
            My Cart
          </Link>
        </li>
        <li style={styles.navItem}>
          <Link to="/chat" style={{ ...styles.link, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MessageCircle size={18} />
            Support
          </Link>
        </li>
        <li style={styles.navItem}>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#a2d2ff',
    padding: '10px 20px',
  },
  logo: {
    color: '#fff',
  },
  navLinks: {
    listStyleType: 'none',
    display: 'flex',
    margin: 0,
    padding: 0,
    alignItems: 'center',
  },
  navItem: {
    marginLeft: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
  },
  logoutButton: {
    backgroundColor: '#fff',
    color: '#a2d2ff',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
};

export default Navbar;