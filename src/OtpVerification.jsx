import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './otp.scss'; // Import the CSS file

const OTPVerification = ({ userId, otp, setOTP }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleVerifyOTP = () => {
    setLoading(true);
    setError(null);

    axios
      .post('https://api.suitscardgame.com/api/v1/admin/verify/otp', {
        email: userId,
        otp: otp,
      })
      .then((response) => {
        const { userId, token } = response.data;
        localStorage.setItem('userId', userId);
        localStorage.setItem('token', token);
        navigate("/admin-panel");
      })
      .catch((error) => {
        console.error('Error verifying OTP:', error);
        setError('OTP verification failed. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="otp-verification-container">
      <input
        className='otpInput'
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
        disabled={loading} // Disable input field while loading
      />
      {loading && <div className="loader"></div>} {/* Display loader while loading */}
      <button className='submit-button' onClick={handleVerifyOTP} disabled={loading}>
        Verify OTP
      </button>
      {error && <div className="error-popup">{error}</div>} {/* Display error popup */}
    </div>
  );
};

export default OTPVerification;
