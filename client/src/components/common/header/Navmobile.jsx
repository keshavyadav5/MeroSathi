import React, { useEffect, useRef } from 'react';
import { RxCross1 } from 'react-icons/rx';
import logo from '../../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const Navmobile = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const navRef = useRef(null);

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);


  const productItem = [
    { name: "Paper Products", slug: "/search?q=Paper_Products", active: false },
    { name: "Gifts", slug: "/search?q=Gifts", active: false },
    { name: "Stationary", slug: "/search?q=Stationary", active: false },
    { name: "Marketing", slug: "/search?q=Marketing", active: false },
    { name: "Merchandise", slug: "/search?q=Event_Merchandise", active: false },
  ];

  return (
    <div
      ref={navRef}
      className={`absolute top-0 left-0 transition-all duration-300 min-h-screen bg-white z-50`}
      style={{ width: isOpen ? '300px' : '0px' }}
    >
      {isOpen && (
        <div className='relative gap-5 px-5 py-5'>
          <div className='flex'>
            <div>
              <img src={logo} alt='logo' className='w-24 h-12 rounded-md' />
            </div>
            <div className='absolute top-5 right-5 border-2 rounded-md border-black'>
              <button
                className='text-black p-1 rounded-full'
                onClick={() => setIsOpen(false)}
              >
                <RxCross1 className='text-xl cursor-pointer' />
              </button>
            </div>
          </div>

          <div className='py-10'>
            <div className='flex flex-col gap-3'>
              <p className='w-full py-2 px-2 bg-white rounded text-xl font-semibold cursor-pointer hover:bg-slate-200 transition-all duration-300'
                onClick={() => {
                  navigate('/');
                  setIsOpen(false);
                }}
              >
                Home
              </p>

              {
                productItem.map((item, index) => {
                  return (
                    <p className='w-full py-2 px-2 bg-white rounded text-xl font-semibold cursor-pointer hover:bg-slate-200 transition-all duration-300' key={item.name}
                      onClick={() => {
                        navigate(`${item.slug}`);
                        setIsOpen(false);
                      }}
                    >
                      {item.name}
                    </p>
                  )
                })
              }


              <p className='w-full py-2 px-2 bg-white rounded text-xl font-semibold cursor-pointer hover:bg-slate-200 transition-all duration-300'
                onClick={() => {
                  navigate('/contact');
                  setIsOpen(false);
                }}
              >
                Contact
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navmobile;
