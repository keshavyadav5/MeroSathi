import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom';

const Private_Admin = () => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.user?.role !== "admin") {
      navigate('/');
    }
  }, [currentUser, navigate]);

  return currentUser?.user?.role ? <Outlet /> : null;
}

export default Private_Admin