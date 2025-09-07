import React , {useState} from 'react';
import { useAuth } from '../context/useAuth';
import UsersList from '../components/usersList';
import Analytics from '../components/analytics';
import AuditLogs from '../components/auditLogs';

const navStyle = {
  marginBottom: '20px',
};

const buttonStyle = {
  marginRight: '10px',
};



function DashboardPage() {
  const { logout } = useAuth();

  const [activeView, setactiveView] = useState("analytics")


  const renderView = ()=>{
    switch(activeView){
      case "users" :
        return <UsersList/>;

      case "analytics":
        return <Analytics/>;
      
      case "audit":
        return <AuditLogs/>;
    }
  }


  return (
     <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>
      <p>Welcome! You are logged in.</p>

      <div style={navStyle}>
        <button style={buttonStyle} onClick={() => setactiveView('analytics')}>Analytics</button>
        <button style={buttonStyle} onClick={() => setactiveView('users')}>Users</button>
        <button style={buttonStyle} onClick={() => setactiveView('audit')}>Audit Logs</button>
      </div>
      
      <hr />
      
      <div>
        {renderView()}
      </div>
    </div>
  );
}

export default DashboardPage;