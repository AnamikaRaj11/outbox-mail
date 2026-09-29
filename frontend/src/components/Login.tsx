import React from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Mocking real Google OAuth flow for now
    // In production, use @react-oauth/google or Firebase Auth
    const mockUser = {
      id: 'user_123',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
    };
    
    login(mockUser);
    navigate('/');
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ReachInbox</h1>
        <p className="text-gray-500 mb-8">Sign in to manage your email outreach.</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg p-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google logo" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
