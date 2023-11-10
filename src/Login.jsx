import React, { useState } from 'react';
import axios from 'axios';
import OTPVerification from './OtpVerification';
import './Login.scss'; // Import the CSS file
import login from './images/login.avif';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [showOTPField, setShowOTPField] = useState(false);
  const [otp, setOTP] = useState('');

  const handleGenerateOTP = () => {
    axios
      .post('https://api.suitscardgame.com/api/v1/admin/send/otp', {
        email: userId,
      })
      .then((response) => {
        setShowOTPField(true);
      })
      .catch((error) => {
        console.error('Error generating OTP:', error);
      });
  };

  return (
    <div className='loginPage'>
      <div className='imagediv'>
        <img src={login} alt="Login Image" className="login-image" />
      </div>

      <div className="login-container">
        <h1 className="login-heading">Enter Your Email To Continue</h1>
        <input
          type="text"
          placeholder="Enter User ID (Email)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="input-field"
        />
        <button onClick={handleGenerateOTP} className="submit-button">Submit</button>

        {showOTPField && <OTPVerification userId={userId} otp={otp} setOTP={setOTP} />}
      </div>
    </div>
  );
};

export default Login;
