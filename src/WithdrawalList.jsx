import React from 'react';

const WithdrawalList = ({ withdrawals }) => {
  return (
    <div>
      <h2>Withdrawal List</h2>
      <ul>
        {withdrawals.map(withdrawal => (
          <li key={withdrawal.id}>
            <strong>User ID:</strong> {withdrawal.userId}<br />
            <strong>Amount:</strong> {withdrawal.amount}<br />
            <strong>Status:</strong> {withdrawal.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WithdrawalList;
