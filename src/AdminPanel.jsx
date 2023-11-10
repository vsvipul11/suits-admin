// AdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar'; // Import the Sidebar component
import { CSVLink } from 'react-csv'; // Import CSVLink from react-csv

import './Admin.css'; // Import the CSS file
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';


const AdminPanel = () => {
  const [activeTable, setActiveTable] = useState('withdrawal'); // Default active table is withdrawal
  const [userData, setUserData] = useState([]);
  const [allUsers, setAllUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [csvData, setCsvData] = useState([]); // State to hold CSV data


  const fetchUsers = (page) => {
    const token = localStorage.getItem('token');
    const apiUrl = `https://api.suitscardgame.com/api/v1/admin/getallusers?page=${page}&size=${itemsPerPage}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        const newData = response.data.data;
        setAllUsers(newData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  useEffect(() => {
    fetchUsers(currentPage); // Fetch users when the component mounts or currentPage changes
  }, [currentPage]); // Dependency array ensures the effect runs when currentPage changes

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = allUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Update current page when pagination is changed
  };
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    const apiUrl = `https://api.suitscardgame.com/api/v1/admin/withdrawl/list?page=${currentPage}&limit=${itemsPerPage}&status=${paymentStatusFilter}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        const filteredData = paymentStatusFilter
          ? response.data.data.filter(user => user.paymentStatus.toLowerCase() === paymentStatusFilter.toLowerCase())
          : response.data.data.reverse();
        setUserData(filteredData);
        console.log(userData);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });

      
    
  }, [currentPage, itemsPerPage, paymentStatusFilter]);

  useEffect(() => {
    // Start fetching data from the first page
    fetchUsers(currentPage);
  }, []);

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userData.slice(indexOfFirstItem, indexOfLastItem);
  // const currentUsers = allUsers.slice(indexOfFirstItem, indexOfLastItem);
  console.log(allUsers);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  const handleFilterChange = (status) => {
    setCurrentPage(1);
    setPaymentStatusFilter(status);
  };

  const convertUTCtoIST = (utcDateTimeString) => {
    try {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'Asia/Kolkata',
      };
  
      const utcDate = new Date(utcDateTimeString);
  
      // Check if the input is a valid date object
      if (!isNaN(utcDate.getTime())) {
        const istDateTimeString = new Intl.DateTimeFormat('en-IN', options).format(utcDate);
        return istDateTimeString;
      } else {
        return "Invalid Date"; // Return a default value or handle the error as needed
      }
    } catch (error) {
      console.error("Error converting date:", error);
      return "Error"; // Return a default value or handle the error as needed
    }
  };

  const handleDeleteUser = (userId) => {
    const token = localStorage.getItem('token');
  
    axios.delete(`https://api.suitscardgame.com/api/v1/admin/delete/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then((response) => {
      // Handle success, update user data if necessary
      console.log(`User with ID ${userId} deleted successfully.`);
      window.location.reload(); // Refresh the page after deletion

      // You might want to refresh the user data after deletion
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
    });
  };
  


  const handlePaymentCompleted = (userId) => {
    const token = localStorage.getItem('token');
    console.log(token);
    console.log(userId);
   
    axios
      .put(`https://api.suitscardgame.com/api/v1/admin/withdrawl/update`, {
           paymentID: userId,
           status: 'Completed',

      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
        
      })
      .then((response) => {
        // Handle success, update user data if necessary
        console.log(`Payment completed for user with ID: ${userId}`);
      })
      .catch((error) => {
        console.error('Error completing payment:', error);
      });
  };

  const handlePaymentRejected = (userId) => {
    const token = localStorage.getItem('token');
    // Make API call to mark payment as rejected
    axios
      .put(`https://api.suitscardgame.com/api/v1/admin/withdrawl/update`, {}, {
        paymentID: userId,
        status: 'Rejected',

  },{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        // Handle success, update user data if necessary
        console.log(`Payment rejected for user with ID: ${userId}`);
      })
      .catch((error) => {
        console.error('Error rejecting payment:', error);
      });
  };

  const fetchUsersForCSV = () => {
    const token = localStorage.getItem('token');
    const apiUrl = 'https://api.suitscardgame.com/api/v1/admin/getallusers';
    
    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then((response) => {
        const newData = response.data.data;
        setAllUsers(newData);
        setCsvData(newData)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };
  
  useEffect(() => {
    fetchUsersForCSV();
  }, []); // Fetch users for CSV once when the component mounts


  return (
    <div className="container">
      {console.log(csvData)}
      <Sidebar setActiveTable={setActiveTable} />
      {activeTable === 'withdrawal' && (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
         
          <h1 className="heading">Withdrawal Request List</h1>
          <div className="filter-buttons">
            <button onClick={() => handleFilterChange('completed')} className={paymentStatusFilter === 'completed' ? 'active' : ''}>Completed</button>
            <button onClick={() => handleFilterChange('processing')} className={paymentStatusFilter === 'processing' ? 'active' : ''}>Processing</button>
            <button onClick={() => handleFilterChange('')} className={!paymentStatusFilter ? 'active' : ''}>All</button>
          </div>
          <table className="user-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>User Name</th>
                <th>Payment Status</th>
                <th>Payment Address</th>
                <th>Amount</th>
                {/* <th>Time</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={index}>
                  <td>{user._id}</td>
                  <td>{user.userName}</td>
                  <td>{user.paymentStatus}</td>
                  <td>{user.paymentAddress}</td>
                  <td>{user.ammount}</td>
                  {/* <td>{convertUTCtoIST(new Date(user.createdAt).toISOString())}</td> Convert createdAt to IST */}
                  <td>
                 {user.paymentStatus !== 'Completed' && (
                 <React.Fragment>
                   <button className='paymentActionButton' onClick={() => handlePaymentCompleted(user._id)}>Approve</button>
                    <button className='paymentActionButton' onClick={() => handlePaymentRejected(user._id)}>Reject</button>
                 </React.Fragment>
                 )}
                </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from({ length: Math.ceil(userData.length / itemsPerPage) }, (_, index) => index + 1).map((number) => (
              <span key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
                {number}
              </span>
            ))}
          </div>
        </div>
      )}
      {activeTable === 'users' && (
  <div className="users-table">
    
    <h1 className="heading">All User Data</h1>
    <CSVLink data={csvData} filename={'users.csv'} className="csv-download-button">
        Download Users CSV
      </CSVLink>

    <table className="user-table">
      <thead>
        <tr>
          <th>User ID</th>
          <th>First Name</th>
          <th>Total Chips</th>
          <th>Total Cash</th>
          <th>Payment Recieved</th>
          <th>Phone</th>
          <th>Actions</th>
          <th> More Info</th>
        </tr>
      </thead>
      <tbody>
      {currentUsers.map((user, index) => (
          <tr key={index}>
            <td>{user._id}</td>
            <td>{user.FullName}</td>
            <td>{user.currentCoin}</td>
            <td>{user.totalCash}</td>
            <td>{user.totalPaymetRecived}</td>
            <td>{user.phone}</td>
            <td>
              <button onClick={() => handleDeleteUser(user._id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </td>
            <Link to={`/user/${user._id}`} className="user-link">
              <button>Know More</button>
            </Link>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="pagination">
        {Array.from({ length: Math.ceil(allUsers.length / itemsPerPage) }, (_, index) => index + 1).map((number) => (
          <button key={number} onClick={() => handlePageChange(number)}>
            {number}
          </button>
        ))}
      </div>
  </div>
)}

    </div>
  );
};
export default AdminPanel;
