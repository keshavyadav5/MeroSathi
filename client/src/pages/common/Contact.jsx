import { Home, MailCheck, PhoneCall } from 'lucide-react'
import React, { useState } from 'react'
import PulsatingButton from "@/components/ui/pulsating-button"

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full Name must be at least 2 characters." }).max(30, { message: "Full Name must not more than 30 characters." }),
  phoneNumber: z.string().min(10, { message: "Phone Number must be at least 10 digits." }).max(10, { message: "Phone Number should not more than 10 digits." }),
  email: z.string().email({ message: "Invalid email address." }),
  subject: z.string().min(3, { message: "Subject must be at least 3 characters." }),
  message: z.string().min(5, { message: "Message must be at least 5 characters." }),
})

const Contact = () => {
  const [result, setResult] = useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values) {
    setResult("Sending...");

    const formData = new FormData();
    formData.append("access_key", "5b5b9092-58ef-4d6a-8e51-c0efe1b4d91a");
    formData.append("fullName", values.fullName);
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("email", values.email);
    formData.append("subject", values.subject);
    formData.append("message", values.message);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      setResult("Message sent! We appreciate your time and will get back to you soon.");
      form.reset();
    } else {
      setResult(data.message);
    }
  }



  return (
    <div className='w-full min-h-screen shadow-md flex items-center justify-center'>
      <div className='flex flex-1 gap-24 lg:gap-10 px-4 sm:px-20 flex-col lg:flex-row py-28'>

        {/* Left- contact info */}
        <div className='flex-1'>
          <div className='mb-10'>
            <PulsatingButton className='cursor-auto bg-gradient-to-tr from-green-500 to-blue-950 mb-5'>
              Contact us
            </PulsatingButton>
            <h1 className='mt-6 mb-2 text-2xl sm:text-3xl font-bold uppercase text-dark dark:text-white sm:text-[40px] lg:text-[36px] xl:text-[32px]'>
              WE'D LOVE TO HEAR FROM YOU
            </h1>
            <p className='mb-9 text-xs leading-relaxed text-body-color dark:text-dark-6'>
              Experiencing an issue? Want to share feedback or ask a question? Get in touch!
            </p>
          </div>
          <div className='space-y-5'>
            <div className='flex items-center gap-5'>
              <div className='h-16 w-16 bg-slate-200 flex items-center justify-center'>
                <Home className='text-2xl text-[#008c3e] font-bold' />
              </div>
              <div>
                <h1 className='font-bold text-xl text-[#008c3e]'>Address</h1>
                <p>123 Main St, Anytown, USA 12345</p>
              </div>
            </div>
            <div className='flex items-center gap-5'>
              <div className='h-16 w-16 bg-slate-200 flex items-center justify-center'>
                <PhoneCall className='text-2xl text-[#008c3e] font-bold' />
              </div>
              <div>
                <h1 className='font-bold text-xl text-[#008c3e]'>Contact Number</h1>
                <p>(+91)4982424135</p>
              </div>
            </div>
            <div className='flex items-center gap-5'>
              <div className='h-16 w-16 bg-slate-200 flex items-center justify-center'>
                <MailCheck className='text-2xl text-[#008c3e] font-bold' />
              </div>
              <div>
                <h1 className='font-bold text-xl text-[#008c3e]'>Email</h1>
                <p>meroemail@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right- contact form */}
        <div className='flex-1 shadow-xl px-5 sm:px-10 py-8 bg-white rounded-lg max-w-[550px] relative z-5'>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className='flex flex-col gap-0'>
                      <FormLabel className='text-[#000000'>Full Name</FormLabel>
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
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#000000]'>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-[#000000]'>Message</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your message" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <span className='text-green-900'>{result}</span>

                </div>
                <Button type="submit" className='w-full bg-[#008c3e] hover:bg-[#12743e]'>Submit</Button>
              </form>
            </Form>
          </div>

          {/* Background circle behind form */}
          <div className='absolute sm:-top-14 -top-5 -right-3 sm:-right-14 w-12 sm:w-32 h-12 sm:h-32 bg-[#008c3e] rounded-full -z-30'></div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
