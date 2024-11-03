import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import Navbar from './Navbar';
import { IoMenu } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CircleUserRound,
  LogOut,
  User,
  ShoppingCartIcon,
  ListOrdered,
} from "lucide-react";
import Navmobile from './Navmobile';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '@/redux/AuthSlice';
import { DashboardIcon } from '@radix-ui/react-icons';

const Header = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const { currentUser } = useSelector(state => state.user || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuth(!!currentUser);
    if (currentUser?.user?.role === 'admin') {
      setIsAdmin(true);
    }
    if (currentUser) {
      const data = (currentUser?.user?.name).split(" ");
      if (data.length < 10) {
        setUserName(data[0]);
      } else {
        let name = data.slice(0, 8).join(" ");
        setUserName(`${name}..`);
      }
    }
  }, [currentUser]);

  const handleSignout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/signout`);
      if (response.data.success) {
        dispatch(logout());
        navigate('/');
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='w-full h-16 py-2 lg:gap-10 px-4 sm:px-20 bg-slate-50 shadow-md sticky top-0 flex justify-between items-center z-50'>
      <div
        className='md:hidden pr-4 cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}>
        <IoMenu size={32} />
      </div>

      <Link to={'/'} className='w-20 flex-1'>
        <img src={logo} alt='logo' className='w-20 h-10 rounded-md' />
      </Link>

      <div className='relative flex-1 hidden md:flex'>
        <Navbar />
      </div>

      <div className='flex-1 md:hidden'>
        <Navmobile isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      <div className='flex-1 flex gap-4 justify-end items-center'>
        <Link to="/cart">
          <div className="relative py-2">
            <div className="top-2 absolute left-1">
              <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                2
              </p>
            </div>
            <ShoppingCartIcon className="w-6 h-6 mt-4" />
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center outline-none">
            <CircleUserRound className="w-8 h-8 mt-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="en">
            <DropdownMenuLabel>
              {isAuth ? `Hello, ${userName}` : 'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isAuth ? (
              <>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User /> Profile
                </DropdownMenuItem>
                {
                  isAdmin ? <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                    <DashboardIcon /> Dashboard
                  </DropdownMenuItem> : <>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <ListOrdered /> Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/cart')}>
                      <ShoppingCartIcon /> Cart
                    </DropdownMenuItem>
                  </>
                }
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignout}>
                  <LogOut /> Logout
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={() => navigate('/auth/signup')}>
                  Signup
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/auth/signin')}>
                  Signin
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
