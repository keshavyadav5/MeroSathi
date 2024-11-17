import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import print from '../../assets/print.png';
import ShimmerButton from "@/components/ui/shimmer-button";
import Services from '@/components/services/Services';
import { File, FileChartPieIcon, FingerprintIcon, Lock, PrinterCheckIcon, ScanBarcodeIcon } from 'lucide-react';
import Marque from './Marque';
import Journey from './Journey';
import { UploadIcon } from '@radix-ui/react-icons';
import { GrDeliver } from 'react-icons/gr';



const Main = () => {
  const typedElement = useRef(null);

  const topData = [
    {
      iconSrcUrl: File,
      heading: "Upload files",
      description: "Upload your files with just a few clicks.",
    },
    {
      iconSrcUrl: FingerprintIcon,
      heading: "Personalize Your Prints",
      description: "Fine-tune every detail to match your exact needs.",
    },
    {
      iconSrcUrl: ScanBarcodeIcon,
      heading: "Seamless Checkout",
      description: "Enjoy a fast, hassle-free checkout experience.",
    },
    {
      iconSrcUrl: PrinterCheckIcon,
      heading: "Enjoy Your Prints",
      description: "Relax as your flawless prints make their way to you.",
    },
  ];

  const downData = [
    {
      iconSrcUrl: UploadIcon,
      heading: "Quick Upload",
      description: "Easily upload your files in a few clicks.",
    },
    {
      iconSrcUrl:FileChartPieIcon,
      heading: "Enhanced Customization",
      description: "Select options that best suit your printing needs.",
    },
    {
      iconSrcUrl: Lock,
      heading: "Secure Checkout",
      description: "Experience a secure and smooth checkout.",
    },
    {
      iconSrcUrl: GrDeliver,
      heading: "Fast Delivery",
      description: "Receive your prints quickly and reliably.",
    },
  ];

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: ['pdf', 'documents', 'cards', 'shirts'],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1500,
      loop: true,
      showCursor: true,
    });

    return () => typed.destroy();
  }, []);

  return (
    <div>
      <div className='relative h-96'>
        <img src={print} alt="print image" className='absolute inset-0 w-full h-full object-cover -z-10' />

        <div className='absolute inset-0 flex flex-col items-center justify-center text-center text-white z-10'>
          <h2 className='text-2xl sm:text-4xl px-8 sm:px-0 mt-4 sm:mt-0 font-bold'>
            Your Sathi is printing <span ref={typedElement}></span>
          </h2>
          <p className='font-light text-sm sm:text-xl py-6 px-10 sm:px-5'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptates, natus?
          </p>
          <ShimmerButton className="shadow-2xl">
            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight lg:text-lg">
              Explore Now
            </span>
          </ShimmerButton>
        </div>
      </div>

      {/** All Horizontal component */}
      <div className='px-4 sm:px-20'>
        <Services />
      </div>


      <div className='flex w-full flex-col py-12 px-4 sm:px-20 gap-28'>

        {/** Print data */}
        <div className='flex justify-between flex-col md:flex-row items-center gap-4'>
          <div className='flex-1 w-full pb-5 md:pb-0'>
            <div className='pb-10'>
              <h2 className='text-4xl md:text-3xl lg:text-4xl font-bold text-[#533d64]'>It's Now Easy To Print</h2>
              <h3 className='text-md pt-2'>You can print anything by sitting in your home</h3>
            </div>
            <div className='flex flex-col gap-4'>
              {topData.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <div className='w-12 h-12 bg-[#894fb6] flex items-center justify-center rounded-full'>
                    <div>{React.createElement(item.iconSrcUrl, { className: 'text-white' })}</div>
                  </div>
                  <div className="flex flex-col justify-center">
                      <h4 className="font-semibold md:text-[18px] text-[14px] text-gray-800 transition-colors duration-300 hover:text-[#894fb6]">
                      {item.heading}
                    </h4>
                    <p className="md:text-sm text-[12px] text-gray-600 transition-colors duration-300 hover:text-[#894fb6]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='shadow-md w-full flex-1'>
            <img src="https://i1.pickpik.com/photos/174/451/755/laptop-computer-macbook-desk-thumb.jpg" alt="laptop" className='w-full h-96 rounded-md object-cover' />
          </div>
        </div>

        {/** Customization */}
        <div className='flex flex-col-reverse md:flex-row justify-between w-full items-center gap-4'>
          <div className='shadow-md w-full flex-1'>
            <img src="https://www.appliedinnovation.com/wp-content/uploads/2021/02/AdobeStock_192783190-scaled.jpeg" alt="laptop" className='w-full h-96 rounded-md object-cover' />
          </div>

          <div className='w-full md:w-1/2 flex flex-col ites md:items-end'>
            <div className='pb-10 text-right'>
              <h2 className='text-4xl font-bold text-[#533d64]'>Customize your prints</h2>
              <h3 className='text-md pt-2'>Explore a wide range of customization options to perfect your order.</h3>
            </div>
            <div className='flex flex-col gap-4 items-end pb-5 md:pb-0'>
              {downData.map((item, index) => (
                <div key={index} className="flex gap-4 items-center text-right">
                  <div className="flex flex-col justify-center">
                    <h4 className="font-semibold md:text-[18px] text-[14px] text-gray-800 transition-colors duration-300 hover:text-[#894fb6]">
                      {item.heading}
                    </h4>
                    <p className="md:text-sm text-[12px] text-gray-600 transition-colors duration-300 hover:text-[#894fb6]">
                      {item.description}
                    </p>
                  </div>
                  <div className='w-12 h-12 bg-[#894fb6] flex items-center justify-center rounded-full'>
                    {React.createElement(item.iconSrcUrl, { className: 'text-white' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>


      {/** marque or what people say */}
      <Marque />

      {/** journey & what people search */}
      <Journey />
    </div>
  );
}

export default Main;
