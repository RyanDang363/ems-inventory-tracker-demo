import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login: setAuthToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const username = searchParams.get('username');

    if (token) {
      // Store token
      localStorage.setItem('token', token);
      
      // Verify token and get user info
      fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // Update auth context
            window.location.href = '/dashboard';
          } else {
            navigate('/login?error=token_invalid');
          }
        })
        .catch(error => {
          console.error('Token verification error:', error);
          navigate('/login?error=token_verification_failed');
        });
    } else {
      navigate('/login?error=no_token');
    }
  }, [searchParams, navigate, setAuthToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;

