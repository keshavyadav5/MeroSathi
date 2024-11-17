import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  fullName: z.string().min(2, { message: "Full Name must be at least 2 characters." }).max(30, { message: "Full Name must not exceed 30 characters." }),
  phoneNumber: z.string().min(10, { message: "Phone Number must be 10 digits." }).max(10, { message: "Phone Number must be 10 digits." }),
  email: z.string().email({ message: "Invalid email address." }),
  gender: z.enum(["male", "female"], { required_error: "Please select a gender" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmpassword: z.string()
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
      confirmpassword: "",
      gender: undefined
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/signup`, {
        name: data.fullName,
        email: data.email,
        phone: data.phoneNumber,
        password: data.password
      }, { withCredentials: true });

      if (response.data.success) {
        toast.success(response?.data?.message);
        navigate('/auth/signin');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
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
              <p className='text-sm text-slate-600'>Already have an account? <Link to='/auth/signin' className='text-[#894fb6] hover:underline ml-1'>Signin</Link></p>
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
                          <Input placeholder="Enter your name" {...field} />
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
                          <Input placeholder="Enter your phone number" {...field} />
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
                  <FormField
                    control={form.control}
                    name="confirmpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-[#000000]'>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem className="space-y-3 flex items-center gap-4">
                        <FormLabel className='mt-3 text-black'>Gender</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-3 space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="male" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Male
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3">
                              <FormControl>
                                <RadioGroupItem value="female" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Female
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <span className='text-red-600 text-sm'>{error}</span>
                  <Button type="submit" className='w-full bg-[#894fb6] hover:bg-[#6c4987]' disabled={loading}>
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
