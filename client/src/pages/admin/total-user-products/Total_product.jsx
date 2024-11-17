import { useDeletePaperProductMutation, useUpdatePaperProductMutation } from '@/redux/Postslice'
import React, { useEffect, useRef, useState } from 'react'
import { BsFilePdfFill } from "react-icons/bs";
import { Delete, Search } from 'lucide-react'
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

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Loading from '@/components/features/Loading'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { Label } from '@radix-ui/react-dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Total_product = () => {

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [getAllProducts, setGetAllPaperProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showEditOption, setShowEditOption] = useState(false)
  const [toDeleteSelectedId, setToDeleteSelectedId] = useState(null)

  const [selectEditId, setSelectEditId] = useState(null);
  const [selectCategory, setSelectCategory] = useState(null)

  const navigate = useNavigate();
  const cardRef = useRef(null);

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
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URI}/api/admin/getAllProducts/?page=${page}&limit=10&search=${search}`, {
        withCredentials: true
      });

      if (response?.data?.success) {

        setGetAllPaperProducts(response?.data?.paperProducts)
      }

    } catch (error) {
      toast.error(error.response.data.message)
      console.log(error.response);
    }
  }

  useEffect(() => {
    AllProduct()
  }, [search, page, toDeleteSelectedId])


  // --------------------------  Handle Delete paperProduct -------------------------------------
  const handleDeletePaperProduct = async (id) => {
    try {
      const response = await deletePaperProduct(id).unwrap();

      if (response?.success) {
        toast.success(response?.message)
        AllProduct()
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setShowDeleteOption(!showDeleteOption);
    }
  };

  const [deletePaperProduct] = useDeletePaperProductMutation({
    refetchOnMountOrArgChange: true,
  });


  // --------------------------  Handle Update paperProduct -------------------------------------
  const [formDataPaperProduct, setFormDataPaperProduct] = useState({
    name: "",
    category: 'paper-product',
    subcategory: '',
    status: '',
    price: 2
  });

  const handleSelectOption = (e) => {
    const { id, value } = e.target || e;
    setFormDataPaperProduct((prevData) => ({
      ...prevData,
      [id]: value
    }));
  };


  // console.log(formDataPaperProduct, selectEditId);
  const [updatePaperProduct] = useUpdatePaperProductMutation({
    refetchOnMountOrArgChange: true,
  });

  const handleUpdatePaperProduct = async () => {
    try {
      const response = await updatePaperProduct({ body: formDataPaperProduct, productId: selectEditId }).unwrap();

      if (response?.success) {
        toast.success('Product updated successfully!');
        AllProduct();
      }
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update product');
    }
    setFormDataPaperProduct({
      name: "",
      category: 'paper-product',
      subcategory: '',
      price: 2,
      status: '',
    })
    setShowEditOption(!showEditOption);
  };




  return (
    <div className='w-full py hidden lg:block overflow-y-auto max-h-screen min-h-screen scrollbar-hide'>
      <div className=''>


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
                <h3 className='font-bold font- text-xl'>32</h3>
                <p className='text-xs'>Gifts</p>
              </div>
            </div>
            <div className='flex items-center bg-purple-100 w-36 px-1 py-1 rounded-md gap-1'>
              <BsFilePdfFill size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold font- text-xl'>25</h3>
                <p className='text-xs'>Stationay</p>
              </div>
            </div>
            <div className='flex items-center bg-blue-100 w-36 px-1 py-1 rounded-md gap-1'>
              <BsFilePdfFill size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold font- text-xl'>51</h3>
                <p className='text-xs'>Marketing</p>
              </div>
            </div>
            <div className='flex items-center bg-blue-100 w-36 px-1 py-1 rounded-md gap-1'>
              <BsFilePdfFill size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold font- text-xl'>91</h3>
                <p className='text-xs'>Merchandise</p>
              </div>
            </div>
          </div>

          <div className='bg-[#e3befe] my-4 py-2 rounded-md px-2 pr-2 flex items-center justify-between'>
            <button
              className='cursor-pointer text-slate-700 hover:text-red-600 font-bold'
              onClick={() => navigate('/admin/dashboard/users')}
            >
              Products
            </button>
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
          {isLoading && <Loading />}
          {error && <p>Error loading products</p>}
          {getAllProducts && getAllProducts.map((item, index) => (
            <div key={item?._id} className='w-full flex justify-between bg-blue-50 px-2 py-1 items-center rounded-md'>
              <img src={item?.image} alt="" className='w-20 h-20' />
              <div className='flex-1 flex justify-between items-end pl-4'>
                <div>
                  <h3 className='font-bold text-sm text-[#894fb6]'>{item?.name}</h3>
                  <p className='text-sm'>Category: {item.category}</p>
                  <p className='text-sm'>Subcategory: {item.subcategory}</p>
                  <p className='text-sm'>Price: {item.price}</p>
                </div>
                <div className='text-center flex gap-4'>
                  <MdEditDocument
                    className='w-6 h-6 cursor-pointer text-[#894fb6] hover:text-[#2ba261] transition-all duration-300'
                    onClick={() => {
                      {
                        setSelectEditId(item?._id);
                        setSelectCategory(item.category)
                        setShowEditOption(!showEditOption)
                      }
                    }
                    }
                  />

                  <MdDelete
                    className='w-6 h-6 cursor-pointer text-red-700 hover:text-red-500 transition-all duration-300'
                    onClick={() => {
                      setToDeleteSelectedId(item?._id)
                      setShowDeleteOption(!showDeleteOption)
                    }}
                  />
                </div>
              </div>

            </div>
          ))}
          {
            showDeleteOption &&
            <div className='absolute top-80 right-80 left0 bottom-0'>
              <Card className="w-[350px]" ref={cardRef}>
                <CardHeader className='items-center flex flex-col'>
                  <CardTitle className='text-xl font-bold'>You are about to delete a product</CardTitle>
                  <CardDescription className='items-center flex flex-col'>
                    <p>This will delete your product from catalog.</p>
                    <p>Are you Sure?</p> </CardDescription>
                </CardHeader>
                <CardFooter
                  className="flex justify-between">

                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteOption(!showDeleteOption)}
                  >Cancel</Button>
                  <Button
                    className='bg-red-700 text-white hover:bg-red-600'
                    onClick={() => handleDeletePaperProduct(toDeleteSelectedId)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </div>
          }
          {
            showEditOption && selectCategory === 'paper-product' &&
            <div className='absolute top-40 right-80 left0 bottom-0'>
              <Card className="w-[350px]" ref={cardRef}>
                <CardHeader>
                  <CardTitle className='text-xl font-bold'>Update Product</CardTitle>
                  <CardDescription>It will permanently update your product catlog.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Name of your product"
                          value={formDataPaperProduct.name}
                          onChange={handleSelectOption}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="category">Category</Label>
                        <Select id="category" value={formDataPaperProduct.category} onValueChange={(value) => handleSelectOption({ target: { id: 'category', value } })}>
                          <SelectTrigger >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="paper-product">Paper Product</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="subcategory">Sub Category</Label>
                        <Select id="category" value={formDataPaperProduct.subcategory} onValueChange={(value) => handleSelectOption({ target: { id: 'subcategory', value } })}>

                          <SelectTrigger
                            id="subcategory">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="document">Document</SelectItem>
                            <SelectItem value="books-and-lab-Manual">Books and Lab Manual</SelectItem>
                            <SelectItem value="photo-pictures">Photo Pictures</SelectItem>
                            <SelectItem value="poster-printing">Poster Printing</SelectItem>
                            <SelectItem value="thesis-and-dissertation">Thesis and Dissertation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="status">Status</Label>
                        <Select id="status" value={formDataPaperProduct.status} onValueChange={(value) => handleSelectOption({ target: { id: 'status', value } })}>

                          <SelectTrigger >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper" >
                            <SelectItem value="uncharacteroized">Uncharacteroized</SelectItem>
                            <SelectItem value="trending">Trending</SelectItem>
                            <SelectItem value="newlaunched">New Launched</SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          placeholder="Price of your product"
                          value={formDataPaperProduct.price}
                          onChange={handleSelectOption}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditOption(!showEditOption)}
                  >Cancel</Button>
                  <Button
                    className='text-white bg-[#008c3e] hover:bg-[#157540] hover:text-white'
                    onClick={handleUpdatePaperProduct}
                  >Update</Button>
                </CardFooter>
              </Card>
            </div>
          }
        </div>


        <div className='mt-10'>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage(prev => Math.max(prev - 1, 1))} className='cursor-pointer' />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage(page <= 1 ? 1 : page - 1)}
                  className='cursor-pointer'
                >
                  {page - 1}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage(page)}
                  className='bg-slate-100 cursor-pointer'
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => setPage(page + 1)}
                  className='cursor-pointer'
                >
                  {page + 1}
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

export default Total_product 