import React from 'react'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='min-h-screen'>
      <Outlet />
    </div>
  )
}

export default Home