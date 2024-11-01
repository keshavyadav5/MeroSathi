import React, { useState, useEffect } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from '@/components/ui/form';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import axios from 'axios';

const emailOtpFormSchema = z.object({
  emailPin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const emailOtpForm = useForm({
    resolver: zodResolver(emailOtpFormSchema),
    defaultValues: {
      emailPin: "",
    },
  });

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => setResendCountdown(prev => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    emailOtpForm.setValue("emailPin", newOtp.join(""));
  };

  const onSubmit = async (data) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/verify-email`, {
      code: data.emailPin,
    }, {
      withCredentials: true
    });
    // console.log("OTP Submitted:", data.emailPin);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    setResendCountdown(20);
    setCanResend(false);
  };

  return (
    <div className="w-full h-full px-4 sm:px-20">
      <div className="flex items-center py-10">
        <div className="flex-1 lg:px-20 sm:px-10 md:px-0">
          <div className="shadow-xl px-5 xs:px-10 py-14 flex flex-col items-center rounded-sm">
            <img
              src="https://img.freepik.com/free-vector/email-campaign-concept-illustration_114360-1681.jpg"
              alt="img"
              className="w-12 self-center"
            />
            <h2 className="uppercase text-xl font-semibold pb-5 py-1">
              Verify Your Email Address
            </h2>
            <div className="w-full h-[0.1px] bg-black"></div>
            <div className="pt-4 text-center flex flex-col items-center">
              <h2 className="text-md font-semibold py-3">
                A verification code has been sent to your email.
              </h2>
              <p className="py-3">
                Please check your inbox and enter the verification code below to verify your email address.
              </p>

              <Form {...emailOtpForm}>
                <form
                  onSubmit={emailOtpForm.handleSubmit(onSubmit)}
                  className="w-1/2 space-y-8 text-center flex flex-col justify-center items-center"
                >
                  <FormField
                    control={emailOtpForm.control}
                    name="emailPin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup className="gap-2">
                              {otp.map((digit, index) => (
                                <InputOTPSlot
                                  key={index}
                                  index={index}
                                  value={digit}
                                  onChange={(e) => handleOtpChange(index, e.target.value)}
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription className="pt-3">
                          Please enter the one-time password sent to your
                          <span className=" font-bold">&nbsp;email</span>.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="bg-[#038C3E] hover:bg-[#1a5b36]"
                  >
                    Verify Account
                  </Button>
                </form>
              </Form>

              <div className="flex gap-3 text-xs xs:text-sm mt-3">
                <p>Didn't receive the verification code?</p>
                <button
                  onClick={handleResend}
                  disabled={!canResend}
                  className={`text-green-600 hover:text-green-700 transition-all duration-300 ${!canResend ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  Resend code {resendCountdown > 0 && `in ${resendCountdown}s`}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 hidden md:block">
          <img
            src="https://img.freepik.com/free-vector/enter-otp-concept-illustration_114360-7897.jpg"
            alt="Verification Illustration"
            className="w-full min-h-[500px]"
          />
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
