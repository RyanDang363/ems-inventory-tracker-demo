import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, Lock, AlertCircle, Sparkles } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (user, pass) => {
    setError('');
    setLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(username, password);
  };

  const handleDemoLogin = () => {
    setUsername('manager1');
    setPassword('password123');
    handleLogin('manager1', 'password123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* DEMO MODE Badge */}
        <div className="mb-4 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg">
            <Sparkles className="h-4 w-4" />
            <span>DEMO MODE</span>
          </div>
        </div>

        <div className="flex items-center justify-center mb-8">
          <Activity className="h-12 w-12 text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">EMS Tracker</h1>
        </div>

        <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Manager Login</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Demo Login Button */}
        <div className="mt-6">
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-5 w-5" />
            <span>Try Demo Account</span>
          </button>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Demo credentials: <span className="font-mono font-semibold">manager1</span> / <span className="font-mono font-semibold">password123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
