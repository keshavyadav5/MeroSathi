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
import { toast } from 'react-toastify';

const formSchema = z.object({
  fullName: z.string({ required_error: "Name is required" }).min(2, { message: "Full Name must be at least 2 characters." }).max(30, { message: "Full Name must not be more than 30 characters." }),
  phoneNumber: z.string({ required_error: "Phone Number is required" }).min(10, { message: "Phone Number must be exactly 10 digits." }).max(10, { message: "Phone Number should not be more than 10 digits." }),
  email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email address." }),
  password: z.string({ required_error: "Password is required" }).min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmpassword: z.string({ required_error: "Password confirmation is required" })
}).refine((data) => data.password === data.confirmpassword, {
  message: "Passwords do not match",
  path: ["confirmpassword"],
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmpassword: ""
    },
  });

  const handleInputChange = () => {
    setLoading(false);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/signup`, {
        name: data.fullName,
        email: data.email,
        phone: data.phoneNumber,
        password: data.password
      }, { withCredentials: true });

      if (response.data.success) {
        toast.success(response?.data?.message)
        navigate('/auth/signin');
      }
    } catch (error) {
      console.error("Error message:", error.message);
      if (error.response) {
        toast.error(error?.response?.data.message)
        setError(error.response.data.message);
        console.error("Response data:", error.response.data);
      }
      setLoading(false); 
    }
  };

  return (
    <div className='px-4 sm:px-20 w-full h-full py-20'>
      <div>
        <div className='w-28 h-12 ml-20'>
          <img src={logo} alt="logo" className='w-full h-full rounded-sm' />
        </div>
        <div className='flex py-6'>
          <div className='flex-1 flex flex-col gap-7'>
            <div>
              <h2 className='text-xl sm:text-3xl py-2 font-bold text-slate-600'>Create An Account</h2>
              <p className='text-sm text-slate-600'>Already have an account? <Link to='/auth/signin' className='text-green-800 hover:underline ml-1'>Signin</Link></p>
            </div>
            <div className='w-full md:max-w-[450px]'>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className='flex flex-col gap-0'>
                        <FormLabel className='text-[#000000]'>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#000000]'>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#000000]'>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} />
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
                          <Input type="password" placeholder="Create Password" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#000000]'>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm Password" {...field} onChange={(e) => { field.onChange(e); handleInputChange(); }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <span className='text-red-600 text-sm'>{error}</span>
                  <Button type="submit" className='w-full bg-[#008c3e] hover:bg-[#12743e]' disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          <div className='flex-1 hidden md:block'>
            <img src="https://t3.ftcdn.net/jpg/03/36/05/88/360_F_336058881_JS6E42vYRoEm4DiORXBxst2s2PagU0Xe.jpg" alt="image" className='w-full h-full' />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
