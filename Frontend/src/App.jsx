import LoginPage from "./pages/loginPage";
import { useAuth } from "./context/useAuth";
import DashboardPage from "./pages/dashBoard";

function App ()
{

  const {isAuthenticated}=useAuth();
  return(
    <div>
      <h1>Super Admin Dashboard</h1>
      <hr />
      {isAuthenticated? <DashboardPage/>:<LoginPage/> }

      
    </div>
  ) 
  
}


export default App;