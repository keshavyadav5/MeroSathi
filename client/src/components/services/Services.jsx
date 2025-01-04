import React, { useEffect, useState } from 'react'
import Horizontalscrool from './Horizontalscrool'
// import { printProducts } from '../../Dummy/Allproducts'
import axios from 'axios'
import { toast } from 'react-toastify'

const Services = () => {
  const [data, setData] = useState([])
  const AllProduct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/admin/getAllProducts`, {
        withCredentials: true
      });

      if (response?.data?.success) {
        setData(response?.data?.data);
      }

    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error.response);
    }
  }
  const trendingProducts = data.filter((item) => item.status === 'trending');
  const newlaunchedProduct = data.filter((item) => item.status === 'newlaunched');
  const upcomingProducts = data.filter((item) => item.status === 'upcoming')


  useEffect(() => {
    AllProduct()
  }, [])
  return (
    <div>
      <Horizontalscrool printProducts={trendingProducts} title="Trending Prouducts" />
      <Horizontalscrool printProducts={newlaunchedProduct} title="New Launches" />
      <Horizontalscrool printProducts={upcomingProducts} title="Upcoming Prouducts" />
    </div>
  )
}

export default Services