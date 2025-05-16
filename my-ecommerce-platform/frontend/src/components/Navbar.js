import React from 'react';
import { useAuth } from '../context/AuthContext'; // Use hook only
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary px-4">
      <Link className="navbar-brand" to="/">ShopEZ</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          {user ? (
            <>
              {user.role === 'owner' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
              )}
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
