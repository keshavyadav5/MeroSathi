import { InstagramLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import React from 'react'
import { Link } from 'react-router-dom'

const Down = () => {
  const d = new Date();
  let year = d.getFullYear();
  return (
    <div className='flex sm:flex-row justify-center border-t-2 items-center py-2 px-auto gap-2'>
      <div className='text-xs xs:text-sm'> Copyright&copy; {year} <Link to="/" className='text-[#894fb6] font-bold'>mero Sathi</Link> All Rights Reserved
      </div>
      <div className="flex gap-2 items-center justify-center">
        <Link to="https://www.instagram.com/k_shav09/" target="_blank" className='text-red-600 text-3xl'>
        <FaInstagram className='text-xl sm:text-3xl'  />
        </Link>
        <Link to="https://www.linkedin.com/feed/" target="_blank" className='text-blue-600'>
        <FaLinkedin className='text-xl sm:text-3xl' color="#0077B5" />
        </Link>
      </div>
    </div>
  )
}

export default Down
