// frontend/src/components/RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'consumer', // or 'owner'
  });
  const [error, setError] = useState('');
  const { login } = useAuth(); // login method from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Registration failed');
      }

      const data = await res.json();
      login(data.user, data.token); // store user and token in context/localStorage
      navigate('/'); // redirect to homepage or dashboard
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input name="name" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input name="email" type="email" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input name="password" type="password" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select name="role" className="form-select" onChange={handleChange}>
            <option value="consumer">Consumer</option>
            <option value="owner">Business Owner</option>
          </select>
        </div>
        <button className="btn btn-primary w-100" type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
