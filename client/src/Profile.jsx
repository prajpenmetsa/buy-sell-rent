import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

function Profile() {
  const location = useLocation();
  const signupData = location.state?.userData;
  const [loading, setLoading] = useState(!signupData);
  const [profileData, setProfileData] = useState(signupData || null);
  const [formData, setFormData] = useState({
    firstName: signupData?.firstName || '',
    lastName: signupData?.lastName || '',
    email: signupData?.email || '',
    age: signupData?.age || '',
    contactNumber: signupData?.contactNumber || ''
  });
  const [editMode, setEditMode] = useState(false);

  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  
  axios.defaults.withCredentials = true;

  
  useEffect(() => {
    if (!profileData) {
      axios.get('http://localhost:3001/profile')
        .then(response => {
          if (response.data && response.data.firstName) {
            setProfileData(response.data);
            setFormData({
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
              age: response.data.age,
              contactNumber: response.data.contactNumber,
            });
            console.log(response.data);
          }
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [profileData]);

  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/profileupdate', formData)
      .then(response => {
        if(response.data.message === "Successfully updated"){
          setProfileData(formData);
          setEditMode(false);
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.error("Error updating profile:", error);
      });
  };

  
  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    axios.post('http://localhost:3001/changepassword', passwordForm)
      .then(response => {
        if(response.data.message === "Password changed successfully") {
          setPasswordSuccess(response.data.message);
          setPasswordForm({
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setShowChangePassword(false);
        }else{
          alert("Error, either old password is wrong or new password dont match")
        }
      })
      .catch(error => {
        const msg = error.response?.data?.error || "Error changing password";
        setPasswordError(msg);
      });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  }

  
  const styles = {
    card: {
      maxWidth: '600px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    heading: {
      textAlign: 'center',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
    },
    buttonGroup: {
      textAlign: 'center',
      marginTop: '20px'
    },
    button: {
      padding: '10px 15px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '0 5px',
    },
    saveButton: {
      backgroundColor: '#a2d2ff',
      color: '#fff',
    },
    cancelButton: {
      backgroundColor: '#a2d2ff',
      color: '#fff',
    },
    editButton: {
      backgroundColor: '#a2d2ff',
      color: '#fff',
    },
    changePasswordButton: {
      backgroundColor: '#ffb3b3',
      color: '#fff',
      marginTop: '10px'
    },
    error: {
      color: 'red',
      textAlign: 'center',
      marginBottom: '10px'
    },
    success: {
      color: 'green',
      textAlign: 'center',
      marginBottom: '10px'
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.card}>
        <h2 style={styles.heading}>Profile</h2>
        {editMode ? (
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="firstName" style={styles.label}>First Name</label>
              <input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="lastName" style={styles.label}>Last Name</label>
              <input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="age" style={styles.label}>Age</label>
              <input
                id="age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="contactNumber" style={styles.label}>Contact Number</label>
              <input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.buttonGroup}>
              <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                style={{ ...styles.button, ...styles.cancelButton }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p><strong>First Name:</strong> {profileData.firstName}</p>
            <p><strong>Last Name:</strong> {profileData.lastName}</p>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Age:</strong> {profileData.age}</p>
            <p><strong>Contact Number:</strong> {profileData.contactNumber}</p>
            <div style={styles.buttonGroup}>
              <button
                onClick={() => setEditMode(true)}
                style={{ ...styles.button, ...styles.editButton }}
              >
                Edit Profile
              </button>
              <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                style={{ ...styles.button, ...styles.changePasswordButton }}
              >
                {showChangePassword ? "Cancel" : "Change Password"}
              </button>
            </div>
          </div>
        )}

        {showChangePassword && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ textAlign: 'center' }}>Change Password</h3>
            {passwordError && <div style={styles.error}>{passwordError}</div>}
            {passwordSuccess && <div style={styles.success}>{passwordSuccess}</div>}
            <form onSubmit={handlePasswordSubmit}>
              <div style={styles.formGroup}>
                <label htmlFor="oldPassword" style={styles.label}>Old Password</label>
                <input
                  id="oldPassword"
                  name="oldPassword"
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="newPassword" style={styles.label}>New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label htmlFor="confirmPassword" style={styles.label}>Confirm New Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  style={styles.input}
                  required
                />
              </div>
              <div style={styles.buttonGroup}>
                <button type="submit" style={{ ...styles.button, ...styles.saveButton }}>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
