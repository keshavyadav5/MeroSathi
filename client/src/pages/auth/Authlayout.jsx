import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const Authlayout = () => {
  const [isAuth, setIsAuth] = useState(false)
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsAuth(!!currentUser);
  }, [currentUser])

  return (
    <div className='min-h-screen'>
      {!isAuth ? (
        <Outlet />
      ) : (
        <Navigate to='/' />
      )}
    </div>
  )
}

export default Authlayout