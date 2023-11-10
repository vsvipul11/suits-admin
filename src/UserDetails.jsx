
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './UserDetails.css'; // Import your CSS file for styling

const UserDetails = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [isTransactionPopupVisible, setTransactionPopupVisible] = useState(false);
  const [isPaymentPopupVisible, setPaymentPopupVisible] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedPayment, setselectedPayment] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get(`https://api.suitscardgame.com/api/v1/admin/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        setUserDetails(response.data);
        
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  const handleGetTransactionDetails = async (transactionId) => {
    // Check if transactionID array is empty
    // if (userDetails.data.transactionId.length === 0) {
    //   // Handle the case where there are no transaction IDs available
    //   console.log('No transaction IDs available for this user.');
    //   return;
    // }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`https://api.suitscardgame.com/api/v1/admin/transaction/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedTransaction(response.data);
      setTransactionPopupVisible(true);
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    }
  };

  const handleGetPaymentDetails = async (paymentId) => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.get(`https://api.suitscardgame.com/api/v1/admin/withdrawl/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setselectedPayment(response.data);
      setPaymentPopupVisible(true);
    } catch (error) {
      console.error('Error fetching withdrawal details:', error);
    }
  };
  

  const renderPaymentHistoryTable = () => {
    const { paymentHistory } = userDetails.data;

    return (
      <div style={{display:'flex', flexDirection: 'column'}}>
        <h3>Withdrawl Payment History</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((paymentId, index) => (
              <tr key={index}>
                <td>{paymentId}</td>
                
                <td>
                  <button onClick={() => handleGetPaymentDetails(paymentId)}>Know More</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

 

  const renderTransactionHistoryTable = () => {
    const { transactionHistory } = userDetails.data;

    return (
      <div style={{display:'flex', flexDirection: 'column'}}>
        <h3> Stripe Transaction History</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactionHistory.map(({ transactionId, status, _id }, index) => (
              <tr key={index}>
                <td>{transactionId}</td>
                <td>{status ? 'Success' : 'Failure'}</td>
                <td>
                  <button onClick={() => handleGetTransactionDetails(transactionId)}>Know More</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const { _id, FullName, accountType, active, phone, currentCoin, totalCash, image, withdrwalLimit, totalPaymetRecived, lastTournamentFee, tournamentStreak } = userDetails.data;
  // const {
  //   _id,
  //   FullName,
  //   accountType,
  //   active,
  //   phone,
  //   currentCoin,
  //   totalCash,
  //   image,
  //   withdrwalLimit,
  //   totalPaymetRecived,
  //   paymentHistory,
  //   lastTournamentFee,
  //   tournamentStreak,
  //   transactionID,
  //   transactionHistory
  // } = userDetails.data;

  return (
    <div className="user-details-container">
      <h2>User Details</h2>
      <div className="user-detail">
        <strong>User ID:</strong> {_id}
      </div>
      <div className="user-detail">
        <strong>Full Name:</strong> {FullName}
      </div>
      <div className="user-detail">
        <strong>Account Type:</strong> {accountType}
      </div>
      <div className="user-detail">
        <strong>Active:</strong> {active ? 'Yes' : 'No'}
      </div>
      <div className="user-detail">
        <strong>Phone:</strong> {phone}
      </div>
      <div className="user-detail">
        <strong>Current Coins:</strong> {currentCoin}
      </div>
      <div className="user-detail">
        <strong>Total Cash:</strong> {totalCash}
      </div>
      <div className="user-detail">
        <strong>Withdrawal Limit:</strong> {withdrwalLimit}
      </div>
      <div className="user-detail">
        <strong>Total Payments Received:</strong> {totalPaymetRecived}
      </div>
      <div className="user-detail">
        <strong>Last Tournament Fee:</strong> {lastTournamentFee}
      </div>
      <div className="user-detail">
        <strong>Tournament Streak:</strong> {tournamentStreak}
      </div>

      {renderPaymentHistoryTable()}
      {renderTransactionHistoryTable()}

      {/* Render the popup component */}
      {isTransactionPopupVisible && (
        <TransactionPopup transaction={selectedTransaction} onClose={() => setTransactionPopupVisible(false)} />
      )}
       {isPaymentPopupVisible && (
        <PaymentPopup payment={selectedPayment} onClose={() => setPaymentPopupVisible(false)} />
      )}
    </div>
  );
};

const TransactionPopup = ({ transaction, onClose }) => {
  if (!transaction) {
    return null;
  }

  const { id, amount, confirmation_method, created, currency, payment_method_types } = transaction.data;
  const createdIST = new Date(created * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return (
    <div className="popup-container">
      <div className="popup-content">
        <strong>Transaction ID:</strong> {id}
        <br />
        <strong>Amount:</strong> {amount}
        <br />
        <strong>Confirmation Method:</strong> {confirmation_method}
        <br />
        <strong>Created (IST):</strong> {createdIST}
        <br />
        <strong>Currency:</strong> {currency}
        <br />
        <strong>Payment Method Types:</strong> {payment_method_types.join(', ')}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const PaymentPopup = ({ payment, onClose }) => {
  if (!payment) {
    return null;
  }

  const { userID, ammount, createdAt, paymentStatus, paymentAddress } = payment.data;
  const createdIST = new Date(createdAt * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return (
    <div className="popup-container">
      
      <div className="popup-content">
        <strong>User ID:</strong> {userID}
        <br />
        <strong>Amount:</strong> {ammount}
        <br />
        <strong>Payment Status</strong> {paymentStatus}
        <br />
        <strong>Created (IST):</strong> {createdIST}
        <br />
        <strong>paymentAddress:</strong> {paymentAddress}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default UserDetails;
