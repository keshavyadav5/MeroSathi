import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = ({ item }) => {
  const { currentUser } = useSelector(state => state.user);
  const navigate = useNavigate()

  const handleNavigate = () => {
    if (currentUser && currentUser?.user?.role === 'admin') {
      toast.error("You must an user to use this facilities")
      return;
    }
    if (item?.category === "paper-product" && currentUser) {
      navigate(`/print-paper-product/${item?.subcategory}`)
    } else {
      navigate('auth/signin')
    }
  }
  return (
    <div onClick={handleNavigate}>
      <div className='w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 rounded-sm flex flex-col items-center overflow-hidden border shadow-md hover:shadow-lg group transition-all duration-300'>

        <div className='w-full h-[80%]'>
          <img src={item.image} alt={item.name} className='w-full h-full object-cover rounded-t-none rounded-b-xl border-b-2 group-hover:scale-x-105 transition-all duration-300' />
        </div>

        <div className='py-2 text-center'>
          <h3 className='text-sm text-slate-800 font-bold'>{item.name.replace(/_/g, " ").replace(/-/g, "/")}</h3>
        </div>
      </div>
    </div>
  )
}

export default Cart