import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom'

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    contactNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const validDomains = [
      '.iiit.ac.in',
      '.students.iiit.ac.in',
      '.research.iiit.ac.in'
    ];
    return validDomains.some(domain => email.endsWith(domain));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || 
        !formData.age || !formData.contactNumber || !formData.password) {
      setError('All fields are required');
      return false;
    }

    if (!validateEmail(formData.email)) {
      setError('Only IIIT email domains are allowed');
      return false;
    }

    if (isNaN(formData.age) || formData.age < 16 || formData.age > 100) {
      setError('Please enter a valid age between 16 and 100');
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit contact number');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/signup', formData);
      if (response.data.message === "Success") {
        console.log(response.data.users)
        navigate('/login');
      } else if(response.data.message === "User already exists"){
        console.log(response.data.message)
        alert("User already exists");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: 'lightblue' }}>
      <div className="card shadow-lg p-4" style={{ width: '24rem' }}>
        <div className="text-center mb-4">
          <i className="bi bi-house-door-fill" style={{ fontSize: '2rem', color: '#007bff' }}></i>
          <h2 className="mt-2">Buy Sell Rent</h2>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              placeholder="example@iiit.ac.in"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
              type="number"
              className="form-control"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactNumber" className="form-label">Contact Number</label>
            <input
              type="tel"
              className="form-control"
              id="contactNumber"
              name="contactNumber"
              placeholder="10-digit number"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-100">Create Account</button>
        </form>
        <Link to="/login" 
            type="button" 
            className="btn btn-secondary w-100 mt-2"
          >
            Login
          </Link>
      </div>
      
    </div>
  );
}

export default Signup;
