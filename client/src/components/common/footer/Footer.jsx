import React from 'react'
import Top from './Top'
import Down from './Down'

const Footer = () => {
  return (
    <div className='flex flex-col w-full h-full border-t-2 shadow-3xl bg-slate-50'>
      <Top />
      <Down />
    </div>
  )
}

export default Footer