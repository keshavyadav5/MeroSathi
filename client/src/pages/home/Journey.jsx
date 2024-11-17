import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Journey = () => {
  const [expanded, setExpanded] = useState(false);

  const faqs = [
    {
      question: "What services does Mero Sathi offer?",
      answer: "Mero Sathi provides a wide range of printing services, including business cards, signage, employee kits, customized gifts, and more, all tailored to meet your specific needs."
    },
    {
      question: "Can I place an order for a single item?",
      answer: "Yes! Mero Sathi allows you to order in small quantities, starting from just one item, perfect for testing ideas or ordering specific quantities without extra cost."
    },
    {
      question: "How can I customize my order?",
      answer: "You can customize your order by choosing from a variety of print styles, materials, and formats. Simply specify your requirements when placing an order, and we'll take care of the rest."
    },
    {
      question: "Does Mero Sathi provide shipping services?",
      answer: "Absolutely! Mero Sathi offers both local and international shipping, ensuring your prints reach you wherever you are."
    },
    {
      question: "What is the delivery timeframe?",
      answer: "Our standard delivery timeframe varies based on the order size and location but typically ranges from 3 to 7 business days for domestic orders."
    },
    {
      question: "Is there customer support for order assistance?",
      answer: "Yes, Mero Sathi has a dedicated support team available to assist with order placement, customization options, and any other questions you may have."
    }
  ];

  return (
    <div className='w-full h-full px-4 sm:px-20 my-10 bg-white'>
      <div>
        <h2 className='text-3xl text-slate-600 py-4 font-[600]'>Mero Sathi: Redefining Print Excellence</h2>
        <p className='py-2'>
          Mero Sathi is dedicated to bringing your visions to life through exceptional print services.
          With years of experience in the print industry, we are your go-to partner for all print needs.
        </p>
        <p className='py-2'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. In reiciendis sequi sapiente libero, optio quos enim omnis. Ut amet iste maiores enim dignissimos eligendi error necessitatibus nihil rem consequatur, doloremque tenetur. Voluptatum, sint saepe?
        </p>

        {expanded && (
          <>
            <p className='py-3'>
              From business cards to customized kits, Mero Sathi offers personalized solutions for businesses
              of all sizes. Our high-quality prints and reliable service have supported countless clients in reaching
              their goals.
            </p>
            <p className='py-3'>
              Headquartered in Nepal, Mero Sathi takes pride in serving customers worldwide, shipping across multiple
              regions to bring your print needs wherever you are. Whether it's corporate gifts, event collateral, or
              small business branding, we've got you covered.
            </p>

            <h3 className='text-2xl font-[600] text-slate-600 py-4'>Bringing Your Ideas to Life</h3>
            <p className='py-3'>
              With an extensive range of customizable products, from print to gifting, we make ordering easy, accessible,
              and affordable. You choose the quantity, and we ensure quality.
            </p>
            <p className='py-3'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Debitis adipisci earum libero provident totam alias reprehenderit itaque placeat reiciendis consequuntur.
            </p>

            <h3 className='text-2xl font-[600] text-slate-600 py-4'>Affordable Pricing, Flexible Quantities</h3>
            <p className='py-3'>
              Starting from just one piece, our options are perfect for small projects or large orders. Experiment with
              new ideas without breaking the bank! Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officia aliquam labore aliquid!
            </p>
          </>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className='text-[#894fb6] font-semibold mt-4'
        >
          {expanded ? '...See Less' : '...See More'}
        </button>
      </div>

      <div className='my-20 sm:grid flex flex-col gap-4 sm:grid-cols-2 lg:grid-cols-4 items-center'>
        <div className='py-3 border-2 w-48 rounded-tr-3xl rounded-bl-3xl items-center flex  flex-col border-[#894fb6] '>
          <h2 className='text-[#894fb6] text-2xl py-1 font-bold'>1M+</h2>
          <p className='text-md text-slate-600'>Happy Clients</p>
        </div>
        <div className='py-4 border-2 w-48 rounded-tr-3xl rounded-bl-3xl items-center flex  flex-col border-[#894fb6] '>
          <h2  className='text-[#894fb6] text-2xl py-1 font-bold'>10000+</h2>
          <p className='text-slate-600'>Personalized Products</p>
        </div>
        <div className='py-4 border-2 border-[#894fb6] w-48 rounded-tr-3xl rounded-bl-3xl items-center flex  flex-col'>
          <h2  className='text-[#894fb6] text-2xl py-1 font-bold'>22 Years</h2>
          <p className='text-slate-600'>of Services Excellence</p>
        </div>
        <div className='py-4 border-2 border-[#894fb6] w-48 rounded-tr-3xl rounded-bl-3xl items-center flex  flex-col'>
          <h2  className='text-[#894fb6] text-2xl py-1 font-bold'>3+</h2>
          <p className='text-slate-600'>Stores across The City</p>
        </div>
      </div>

      <h2 className='text-3xl text-slate-600 py-4 pt-10 font-[600]'>Popular Searches</h2>

      <Accordion type="single" collapsible className="w-full grid-cols-2 mb-20">
        <div className='grid grid-cols-1 md:grid-cols-2'>
          {faqs.map((item, index) => (
            <AccordionItem
              value={`faq-${index}`}
              key={index}
              className='mr-0 sm:mr-10 md:mr-10 lg:mr-16'
            >
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </div>
      </Accordion>
    </div>
  );
};

export default Journey;
