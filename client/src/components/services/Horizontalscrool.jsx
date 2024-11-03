import React, { useRef } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import Cart from './Cart';

const HorizontalScroll = ({ printProducts, title }) => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -260,
      behavior: 'smooth',
    }); 
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 260,
      behavior: 'smooth',
    });
  };

  return (
    <div className='py-4 sm:py-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl sm:text-3xl py-2 font-bold underline text-slate-600'>{title}</h2>
        <div className='flex gap-4 text-white font-extrabold'>
          <div className='w-7 h-7 sm:w-8 sm:h-8 items-center justify-center flex rounded-full bg-[#2a95a8]'>
            <GrPrevious onClick={scrollLeft} className='cursor-pointer' />
          </div>
          <div className='w-7 h-7 sm:w-8 sm:h-8 items-center justify-center flex rounded-full bg-[#41a16c]'>
            <GrNext onClick={scrollRight} className='cursor-pointer text-md' />
          </div>
        </div>
      </div>

      <div className='flex gap-5 overflow-x-scroll scrollbar-hide py-4 cursor-pointer' ref={scrollRef} >

        {printProducts.map((item, index) => (
          <Cart key={item._id || item.id + index} item={item} />
        ))}

      </div>
    </div>
  );
};

export default HorizontalScroll;
