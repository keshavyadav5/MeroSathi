import React from 'react'
import Horizontalscrool from './Horizontalscrool'
import { printProducts } from '../../Dummy/Allproducts'

const Services = () => {
  return (
    <div>
      <Horizontalscrool printProducts={printProducts} title = "Popular Prouducts" />
      <Horizontalscrool printProducts={printProducts} title = "New Launches" />
      <Horizontalscrool printProducts={printProducts} title = "Upcoming Prouducts" />
    </div>
  )
}

export default Services