import React, { useRef } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';

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

      <div className='flex gap-5 overflow-x-scroll scrollbar-hide py-4' ref={scrollRef}>

        {printProducts.map((item, index) => (
          <div key={index} className='w-48 h-48 sm:w-56 sm:h-56 flex-shrink-0 rounded-sm flex flex-col items-center overflow-hidden border shadow-md'>

            <div className='w-full h-[80%]'>
              <img src={item.image} alt={item.name} className='w-full h-full object-cover rounded-t-none rounded-b-xl border-b-2' />
            </div>

            <div className='py-2 text-center'>
              <h3 className='text-sm text-slate-800 font-bold'>{item.name.replace(/_/g, " ").replace(/-/g, "/")}</h3>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default HorizontalScroll;
