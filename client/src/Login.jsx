import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

function Login() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [error, setError] = useState('');
  
  useEffect(() =>{
    axios.get('http://localhost:3001/verify_user')
    .then(res => {
      if(res.data === "Verified") navigate('/profile');
    })
});
  

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return false;
    }
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA challenge.');
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

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      
      const payload = { ...formData, recaptchaToken };
      const response = await axios.post('http://localhost:3001/login', payload);
      if (response.data === 'Success') {
        console.log("Success");
        navigate('/profile');
      } else {
        console.log(response.data);
        console.log("error");
        setError(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: 'lightblue' }}>
      <div className="card shadow-lg p-4" style={{ width: '24rem' }}>
        <div className="text-center mb-4">
          <i className="bi bi-house-door-fill" style={{ fontSize: '2rem', color: '#007bff' }}></i>
          <h2 className="mt-2">Buy Sell Rent - Login</h2>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
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
          <div className="mb-3" style={{ margin: '20px 0' }}>
            <ReCAPTCHA
              sitekey="6LfUFs0qAAAAAK1i6G-iAxN27OBVdIqWiGZfd_jD"
              onChange={handleRecaptchaChange}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="mt-3">
          <a
            href="http://localhost:3001/cas-login"
            className="btn btn-info w-100"
          >
            Login via CAS
          </a>
        </div>
        <Link
          to="/register"
          type="button"
          className="btn btn-secondary w-100 mt-2"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}

export default Login;
