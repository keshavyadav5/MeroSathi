import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';

const PrivateAuth = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth/signin');
    }
  }, [currentUser, navigate]);

  return currentUser ? <Outlet /> : null;
};

export default PrivateAuth;
