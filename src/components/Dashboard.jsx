// src/components/Dashboard.jsx
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

const Dashboard = () => {
  const user = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="dashboard">
      <h1>Welcome {user?.email}</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Your Actions</h2>
      <ul>
        <li><Link to="/create-group">Create Group</Link></li>
        <li><Link to="/join-group">Join Group</Link></li>
        <li><Link to="/groups">View All Groups</Link></li>
      </ul>
    </div>
  );
};

export default Dashboard;
