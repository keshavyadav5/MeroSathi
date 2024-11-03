import React, { useEffect, useState } from 'react'
import Horizontalscrool from './Horizontalscrool'
import { printProducts } from '../../Dummy/Allproducts'
import { useGetAllPaperProductQuery } from '@/redux/Postslice'

const Services = () => {
  const [data, setData] = useState([])
  const { data: paperProducts, isLoading, isError, refetch } = useGetAllPaperProductQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  useEffect(() => {
    if (paperProducts) {
      setData(paperProducts)
    }
  }, [paperProducts])
  return (
    <div>
      <Horizontalscrool printProducts={data} title="Paper Prouducts" />
      <Horizontalscrool printProducts={printProducts} title="New Launches" />
      <Horizontalscrool printProducts={printProducts} title="Upcoming Prouducts" />
    </div>
  )
}

export default Services