import React from 'react';
import { Navigate } from 'react-router-dom';
import { SignupForm } from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12">
      <SignupForm />
    </div>
  );
};

export default Signup;