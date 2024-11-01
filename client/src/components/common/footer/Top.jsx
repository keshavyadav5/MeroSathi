import React from 'react'
import logo from '../../../assets/logo.png'
import bank from '../../../assets/bank.png'
import { MailIcon, PhoneCallIcon } from 'lucide-react'
import { GrFormNext } from "react-icons/gr"
import { Link } from 'react-router-dom'

const Top = () => {
  const usefulLink = [
    { name: 'Home', link: '/' },
    { name: 'About Us', link: '/about' },
    { name: 'Privacy Policy', link: '/privacy' },
    { name: 'Shipping and Delivery Policy', link: '/shipping-policy' },
  ]
  const support = [
    { name: 'Contact Us', link: '/contact' },
    { name: 'Price Calculator', link: '/price-calculator' },
    { name: 'Terms of Service', link: '/terms' },
    { name: 'Refund Policy', link: '/refund-policy' },
  ]

  return (
    <div className='w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-20 py-10'>
      <div className='flex flex-col gap-3'>
        <img src={logo} alt="logo" className='w-32 h-12' />
        <p className='text-md'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi soluta illum fugiat. Pariatur.
        </p>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-3'>
            <PhoneCallIcon className='text-[#008c3e]' />
            <p>(+91) 4345239810</p>
          </div>
          <div className='flex items-center gap-3'>
            <MailIcon className='text-[#008c3e]' />
            <a href='mailto:kesavyadav992@gmail.com' className='hover:underline'>
              meroemail@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div>
        <h2 className='text-xl font-bold text-[#008c3e] sm:mb-4 mb-1'>Useful Links</h2>
        {usefulLink.map((data, index) => (
          <Link key={index} to={data.link} className='flex items-center gap-1 py-1'>
            <GrFormNext className='text-[#008c3e] text-xl' />
            {data.name}
          </Link>
        ))}
      </div>

      <div>
        <h2 className='text-xl font-bold text-[#008c3e] sm:mb-4 mb-1'>Support</h2>
        {support.map((data, index) => (
          <Link key={index} to={data.link} className='flex items-center gap-1 py-1'>
            <GrFormNext className='text-[#008c3e] text-xl' />
            {data.name}
          </Link>
        ))}
      </div>

      <div>
        <h2 className='text-xl font-bold text-[#008c3e] sm:mb-4 mb-1'>Other Info</h2>
        <p className='mb-4'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat iure commodi modi laborum placeat aperiam impedit rem iusto doloribus minus tempore optio aliquid voluptas, soluta nulla enim est maxime!
        </p>
        <img src={bank} alt="bank icon" className='w-full max-w-xs' />
      </div>
    </div>
  )
}

export default Top
