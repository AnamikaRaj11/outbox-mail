import React from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const res = await axios.post('http://localhost:3000/api/auth/google', {
        credential: credentialResponse.credential
      });
      login(res.data);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md text-center flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ReachInbox</h1>
        <p className="text-gray-500 mb-8">Sign in to manage your email outreach.</p>
        
        <GoogleLogin 
          onSuccess={handleGoogleSuccess} 
          onError={() => alert('Login Failed')} 
        />
      </div>
    </div>
  );
};

export default Login;
