import { useState } from 'react';
// import './LoginPage.css'; // ⬅️ Import the CSS

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');

  const users = [
    { username: 'admin', email: 'admin@example.com', password: 'admin123', name: 'Mbams Admin' },
    { username: 'chris', email: 'chrisnugo@gmail.com', password: 'password123', name: 'Christopher Mbams' }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = users.find(
      (user) =>
        (user.username === form.identifier || user.email === form.identifier) &&
        user.password === form.password
    );

    if (user) {
      localStorage.setItem('token', 'your-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } else {
      setError('Invalid login credentials');
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label htmlFor="identifier">Username or Email</label>
        <input
          type="text"
          id="identifier"
          name="identifier"
          value={form.identifier}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}
