import React from 'react';
import { useAuth } from '../context/useAuth';
import UsersList from '../components/usersList';

function DashboardPage() {
  const { logout } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome! You are logged in.</p>
      <button onClick={logout}>Logout</button>
      
      <hr />
      <UsersList/>
    </div>
  );
}

export default DashboardPage;