import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { signinFailed, signinStart, signinSuccess } from '@/redux/AuthSlice';
import { toast } from 'react-toastify';
import { addCartProduct } from '@/redux/Cartslice';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  })
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setIsError] = useState(null)

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(false);
    try {
      dispatch(signinStart());
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/signin`, {
        email: data.email,
        password: data.password
      }, { withCredentials: true });

      if (response.data.success) {
        dispatch(signinSuccess(response.data));
        setLoading(false)
        toast.success(response.data.message)

        if (response?.data?.user?.role === 'user') {
          const cartData = await axios.get('http://localhost:3000/api/user/getAll-cart-items', {
            withCredentials: true,
          });

          dispatch(addCartProduct(cartData.data));
        }
        navigate('/');
      }
    } catch (error) {
      setIsError(error.message);
      if (error.response) {
        toast.error(error.response.data.message)
      }
      dispatch(signinFailed(error.response ? error.response.data.message : "An unexpected error occurred"));
    } finally {
      setLoading(false)
    }
  };


  return (
    <div className='px-4 sm:px-20 w-full h-full py-20'>
      <div className='flex py-6'>
        <div className='flex-1 hidden md:block'>
          <img src="https://st.depositphotos.com/18722762/51522/v/450/depositphotos_515228796-stock-illustration-online-registration-sign-login-account.jpg" alt="image" className='w-full min-h-96' />
        </div>
        <div className='flex-1 flex flex-col gap-7'>
          <div>
            <div className='w-28 h-12 ml-20'>
              <img src={logo} alt="logo" className='w-full h-full rounded-sm' />
            </div>
            <h2 className='text-xl sm:text-3xl py-2 font-bold text-slate-600'>Signin to Your Account</h2>
            <p className='text-sm text-slate-600'>Don't have an account? <Link to='/auth/signup' className='text-green-800 hover:underline ml-1'>Signup</Link></p>
          </div>
          <div className='w-full md:max-w-[450px] items-end'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#000000]'>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#000000]'>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create Password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <span className='text-red-600 text-sm'>{error}</span>}
                <Button type="submit" className='w-full bg-[#008c3e] hover:bg-[#12743e]' disabled={loading}>
                  {loading ? <span className="spinner-border spinner-border-sm mr-2"></span> : null}
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
