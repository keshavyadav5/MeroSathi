import React, { useEffect, useState } from 'react'
import adminBoy from '../../assets/adminBoy.jpg'
import adminGirl from '../../assets/adminGirl.jpg'
import { useSelector } from 'react-redux'
import { Cross1Icon } from '@radix-ui/react-icons'

import { Outlet } from 'react-router-dom'
import Total_product from './total-user-products/Total_product'
import Total_user from './total-user-products/Total_user'



const Details = () => {
  const [user, setUser] = useState('');
  const [showAdminName, setShowAdminName] = useState(true);
  const [showProduct, setShowProduct] = useState(true);

  const { currentUser } = useSelector(state => state.user || {});

  useEffect(() => {
    const data = currentUser?.user?.name?.split(' ');
    setUser(data ? data[0] : '');
  }, [currentUser]);


  return (
    <div className='w-full lg:pl- xl:pl-16 py-10 hidden lg:block overflow-y-auto max-h-screen min-h-screen scrollbar-hide'>
      <div>

        {/** Admin photo and role  */}
        {
          showAdminName && <div className='relative'>
            <div className='flex justify-between bg-green-100 items-center rounded-xl px-12 py-1'>
              <div>
                <h2 className='text-3xl font-bold font-mono'>Hi, {user}</h2>
                <p>Ready to start your day with some pitch desk?</p>
              </div>
              <div>
                {
                  currentUser && currentUser?.user?.gender === 'male' ? <img className='w-32' src={adminBoy} alt="adminBoy" /> : <img className='w-32' src={adminGirl} alt="adminGirl" />
                }

              </div>
            </div>
            <div
              className='absolute top-2 right-2 bg-white p-1 rounded-full text-red-500 cursor-pointer'
              onClick={() => setShowAdminName(!showAdminName)}
            >
              <Cross1Icon />
            </div>
          </div>
        }
        <Outlet />
      </div>
    </div>
  )
}

export default Details