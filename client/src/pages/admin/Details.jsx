import { useGetAllPaperProductQuery } from '@/redux/Postslice'
import React, { useEffect, useState } from 'react'
import adminBoy from '../../assets/adminBoy.jpg'
import adminGirl from '../../assets/adminGirl.jpg'
import { useSelector } from 'react-redux'
import { BsFilePdfFill } from "react-icons/bs";
import { Cross1Icon } from '@radix-ui/react-icons'
import { Search } from 'lucide-react'
import { MdDelete, MdEditDocument } from "react-icons/md";
import axios from 'axios'


import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


const Details = () => {
  const [user, setUser] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showAdminName, setShowAdminName] = useState(true);
  const [getAllProducts, setGetAllPaperProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = useSelector(state => state.user || {});

  useEffect(() => {
    const data = currentUser?.user?.name?.split(' ');
    setUser(data ? data[0] : '');
  }, [currentUser]);

  // const { data: getAllProducts, error, isLoading, refetch } = useGetAllPaperProductQuery(
  //   { page, search },
  //   { refetchOnMountOrArgChange: true }
  // );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // useEffect(() => {
  //   refetch();
  // }, [search, page, refetch]);

  const AllProduct = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/admin/getAllProducts/?page=${page}&limit=10&search=${search}`);

      if (response?.data?.success) {
        console.log();

        setGetAllPaperProducts(response?.data?.paperProducts)
      }

    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error.response);
    }
  }

  useEffect(() => {
    AllProduct()
  }, [search, page])


  // --------------------------  Handle Delete paperProduct -------------------------------------
  const handleDeletePaperProduct = async (id) => { }




  return (
    <div className='w-full lg:pl- xl:pl-16 py-10 hidden lg:block overflow-y-auto max-h-screen min-h-screen scrollbar-hide'>
      <div>

        {/** Admin photo and role  */}
        {
          showAdminName && <div className='relative'>
            <div className='flex justify-between bg-green-100 items-center rounded-xl px-12 py-1'>
              <div>
                <h2 className='text-3xl font-bold font-mono'>Hi, {user}</h2>
                <p>Ready to start your day with some pitch desk?</p>
              </div>
              <div>
                {
                  currentUser && currentUser?.user?.gender === 'male' ? <img className='w-32' src={adminBoy} alt="adminBoy" /> : <img className='w-32' src={adminGirl} alt="adminGirl" />
                }

              </div>
            </div>
            <div
              className='absolute top-2 right-2 bg-white p-1 rounded-full text-red-500 cursor-pointer'
              onClick={() => setShowAdminName(!showAdminName)}
            >
              <Cross1Icon />
            </div>
          </div>
        }


        {/** Total no of products and search box */}

        <div className='py-2'>
          <h3 className='text-slate-600 pb-1'>Overview</h3>
          <div className='grid grid-cols-4 gap-1 xl:flex xl:justify-between items-center'>
            <div className='flex items-center bg-orange-100 w-36 px-1 py-1 rounded-md gap-1'>
              <BsFilePdfFill size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold font- text-xl'>12</h3>
                <p className='text-xs'>Paper Product</p>
              </div>
            </div>
            <div className='flex items-center bg-rose-100 w-36 px-1 py-1 rounded-md gap-1'>
              <BsFilePdfFill size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold font- text-xl'>12</h3>
                <p className='text-xs'>Paper Product</p>
              </div>
            </div>
            <div className='flex items-center bg-purple-100 w-36 px-1 py-1 rounded-md gap-1'>
              <BsFilePdfFill size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold font- text-xl'>12</h3>
                <p className='text-xs'>Paper Product</p>
              </div>
            </div>
            <div className='flex items-center bg-blue-100 w-36 px-1 py-1 rounded-md gap-1'>
              <BsFilePdfFill size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold font- text-xl'>12</h3>
                <p className='text-xs'>Paper Product</p>
              </div>
            </div>
            <div className='flex items-center bg-blue-100 w-36 px-1 py-1 rounded-md gap-1'>
              <BsFilePdfFill size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold font- text-xl'>12</h3>
                <p className='text-xs'>Paper Product</p>
              </div>
            </div>
          </div>

          <div className='bg-green-100 my-4 py-2 rounded-md px-2 pr-2 flex items-center justify-between'>
            <button className='cursor-pointer text-slate-700 hover:text-red-600 font-bold'>Products</button>
            <div className='flex items-center'>
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange} // Capture search input
                className="xl:w-96 lg:w-80 h-10 rounded-l-sm outline-none px-2"
              />
              <div className='bg-blue-100 h-10 w-10 items-center flex justify-center rounded-r-full cursor-pointer'>
                <Search />
              </div>
            </div>
          </div>
        </div>

        {/** All the products  */}
        <div className='flex flex-col gap-2'>
          {isLoading && <p>Loading...</p>}
          {error && <p>Error loading products</p>}
          {getAllProducts && getAllProducts.map((item, index) => (
            <div key={index} className='w-full flex justify-between bg-blue-50 px-2 py-1 items-center rounded-md'>
              <img src={item?.image} alt="" className='w-20 h-20' />
              <div className='flex-1 flex justify-between items-end pl-4'>
                <div>
                  <h3 className='font-bold text-sm text-[#008c3e]'>{item?.name}</h3>
                  <p className='text-sm'>Category: {item.category}</p>
                  <p className='text-sm'>Subcategory: {item.subcategory}</p>
                  <p className='text-sm'>Price: {item.price}</p>
                </div>
                <div className='text-center flex gap-4'>
                  <MdEditDocument
                    className='w-6 h-6 cursor-pointer text-[#008c3e] hover:text-[#2ba261] transition-all duration-300'

                  />

                  <MdDelete className='w-6 h-6 cursor-pointer text-red-700 hover:text-red-500 transition-all duration-300' />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-10'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage(prev => Math.max(prev - 1, 1))} className='cursor-pointer' />
              </PaginationItem>
              {/* {[...Array(3)].map((_, idx) => (
                <PaginationItem key={idx}>
                  <PaginationLink
                    onClick={() => setPage(idx + 1)}
                    isActive={page === idx + 1}
                    className='cursor-pointer'
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))} */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage(page)}
                  className='cursor-pointer'
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage(page + 1)}
                  className='bg-slate-100 cursor-pointer'
                >
                  {page + 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage(page + 2)}
                  className='cursor-pointer'
                >
                  {page + 2}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext onClick={() => setPage(prev => prev + 1)} className='cursor-pointer' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

export default Details