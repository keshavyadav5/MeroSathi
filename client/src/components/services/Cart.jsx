import React from 'react'
import { useNavigate } from 'react-router-dom';

const Cart = ({ item }) => {

  const navigate = useNavigate()

  const handleNavigate = () => {
    if (item?.category === "paper-product") {
      navigate(`/print-paper-product/${item?.subcategory}`)
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