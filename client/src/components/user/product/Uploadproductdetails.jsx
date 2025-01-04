import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import Loading from '@/components/features/Loading';
import { Button } from '@/components/ui/button';
import { FaPencil } from "react-icons/fa6";
import { FaUpload } from "react-icons/fa";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const Uploadproductdetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { name } = useParams();
  const [image, setImage] = useState('');
  const [description, setDescription] = useState([]);

  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    name: '',
    quantity: 1,
    price: 0,
    printlocation: 'front',
    color: 'black',
    fontlogosize: '4/4',
    backlogosize: '4/4',
    size: "m",
    logo: ""
  });

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/user/add-cart-product`,
        {
          category: formData.category,
          subcategory: formData.subcategory,
          name: formData.name,
          quantity: formData.quantity,
          price: formData.price,
          printlocation: formData.printlocation,
          color: formData.color,
          fontlogosize: formData.fontlogosize,
          backlogosize: formData.backlogosize,
          size: formData.size,
          logo: formData.logo
        },
        { withCredentials: true }
      );
      console.log(response);

      toast.success('Product added to cart');
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "error to upload the cart")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const AllProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/admin/getAllProducts/?page=1&limit=10&search=${name || ''}`,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        const product = response?.data?.data?.[0] || {};
        setData(response?.data?.data || []);
        setDescription(product?.description?.split('.') || []);
        setImage(product?.images?.[0] || '');
        setFormData({
          ...formData,
          category: product?.category || '',
          subcategory: product?.subcategory || '',
          name: product?.name || '',
          price: product?.price || '',
        });
      } else {
        toast.error('Failed to fetch products');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An error occurred while fetching products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AllProduct();
  }, [name]);

  return (
    <div className="w-full px-4 sm:px-20 py-6 relative">
      {loading ? (
        <Loading />
      ) : data.length > 0 ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex flex-col">
            <div className="w-full md:h-[400px border-2 rounded-md items-center justify-center flex">
              {image ? (
                <img src={image} alt="Product" className="w-full xl:h-full object-cover" />
              ) : (
                <p className="text-gray-500">No image available</p>
              )}
            </div>
            <div className="mt-2 flex border-2 p-2 rounded justify-between">
              {data[0]?.images?.map((item, index) => (
                <img
                  key={index + item}
                  src={item}
                  alt={`Thumbnail ${index}`}
                  className="w-16 lg:w-24 object-cover border-2 rounded-md cursor-pointer hover:opacity-80"
                  onClick={() => setImage(item)}
                />
              ))}
            </div>
          </div>
          <div className="flex-1 sm:ml-4">
            <h2 className="text-3xl md:text-4xl lg:5xl mt-4 sm:mt-0 text-slate-600 font-bold mb-5">{data[0]?.name}</h2>
            {
              description.map((item, index) => (
                item?.length > 1 && (
                  <li key={index} className="text-slate-500">
                    {item}
                  </li>
                )
              ))
            }

            <div className='mt-5'>
              {
                data?.[0].status === 'upcoming' &&
                <div>
                  <div className='flex  flex-col sm:flex-row gap-4'>
                    <div className=' p-3 border rounded-md '>
                      <p className='text-3xl font-semibold text-orange-500'>Rs. {data?.[0].price} <span className='text-sm text-slate-600'>inclusive all taxes</span></p>
                      <p className='text-purple-700'>for 1 Qty {data?.[0].price} / piece</p>
                    </div>

                    <div className='flex-1  p-3 border sm:w-1/3 rounded-md font-semibold text-green-700'>
                      we are still working on it, we will notify you after product available!!!
                    </div>
                  </div>

                  <Link to='/'>
                    <Button className='bg-[#533d64] hover:bg-[#6a4c81] transition-all duration-300 mt-4 px-8'>Explore more!</Button>
                  </Link>
                </div>
              }
            </div>

            <div>
              {
                data?.[0].status !== 'upcoming' &&
                <>
                  <form className='w-full flex flex-col gap-2'>
                    {
                      (data[0]?.type === 'sweeter' || data[0]?.type === 'tshirt') &&
                      <>
                        <div className='flex-1 flex items-center justify-between'>
                          <label className='text-slate-700 font-semibold text-lg flex-1'>Fabric Colors</label>
                          <select
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            className="w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded flex-1"
                            required
                          >
                            <option value="black">Black</option>
                            <option value="white">White</option>
                            <option value="Navy_blue">Navy Blue</option>
                            <option value="Green">Green</option>
                          </select>
                        </div>

                        <div className='flex-1 flex items-center justify-between'>
                          <label className='text-slate-700 font-semibold text-lg flex-1 '>Print Location</label>
                          <select
                            name="printlocation"
                            value={formData.printlocation}
                            onChange={handleInputChange}
                            className="flex-1 w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded"
                            required
                          >
                            <option value="front">Front</option>
                            <option value="back">Back</option>
                            <option value="f&b">Front & Back</option>
                          </select>
                        </div>

                        <div className='flex-1 flex items-center justify-between'>
                          <label className='text-slate-700 font-semibold text-lg flex-1'>Front Print Size</label>
                          <select
                            name="fontlogosize"
                            value={formData.fontlogosize}
                            onChange={handleInputChange}
                            className="flex-1 w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded"
                            required
                          >
                            <option value="4/4">4 X 4</option>
                            <option value="4/6">4 X 6</option>
                            <option value="6/6">6 X 6</option>
                            <option value="8/8">8 X 8</option>
                          </select>
                        </div>

                        <div className='flex-1 flex items-center justify-between'>
                          <label className='text-slate-700 font-semibold text-lg flex-1'>Back Print Size</label>
                          <select
                            name="backlogosize"
                            value={formData.backlogosize}
                            onChange={handleInputChange}
                            className="w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded flex-1"
                            required
                          >
                            <option value="4/4">4 X 4</option>
                            <option value="4/6">4 X 6</option>
                            <option value="6/6">6 X 6</option>
                            <option value="8/8">8 X 8</option>
                            <option value="12/12">12 X 12</option>
                          </select>

                        </div>
                        {
                          (data[0]?.type === 'sweeter' || data[0]?.type === 'tshirt') &&
                          <RadioGroup
                            defaultValue="comfortable"
                            className='flex py-3 gap-4 w-full items-center justify-end pr-3'
                            // value={formData.size}
                            // defaultValue='m'
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}

                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="s" name="s" />
                              <Label htmlFor="s">S</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="m" name="m" />
                              <Label htmlFor="m">M</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="l" name="l" />
                              <Label htmlFor="l">L</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="xl" name="xl" />
                              <Label htmlFor="xl">XL</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="xxl" name="xxl" />
                              <Label htmlFor="xxl">XXL</Label>
                            </div>
                          </RadioGroup>
                        }
                      </>
                    }

                    <div className='flex-1 flex items-cente justify-between'>
                      <label className='text-slate-700 font-semibold text-lg flex-1'>Qunatity</label>
                      <div className='flex flex-col gap-1 w-full p-2 my-1 outline-none border-gray-300 rounded flex-1'>
                        <input
                          type="number"
                          name="quantity"
                          id="quantity"
                          placeholder='1'
                          onChange={handleInputChange}
                          className="w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded flex-1"
                        />
                        <p className='text-xs text-slate-500'>Choose a quantity between 1 - 1000 for instant ordering. For higher quantities, you will be allowed to request quotations from Sales Team.</p>
                      </div>
                    </div>
                    <div className='flex  flex-col sm:flex-row gap-4 mt-10 mb-4 items-center justify-center'>
                      <div className=' p-3 w-full border rounded-md flex-1'>
                        <p className='text-3xl font-semibold text-orange-500'>Rs. {data?.[0].price} <span className='text-sm text-slate-600'>inclusive all taxes</span></p>
                        <p className='text-purple-700'>for 1 Qty {data?.[0].price} / piece</p>
                      </div>

                      <div className="w-full h-full flex-1 flex flex-col gap-1 p-3 border">
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer py-2 px-4 border rounded flex gap-2 items-center justify-center text-sm bg-[#533d64] hover:bg-[#815e9c] text-white transition-all duration-300"
                        >
                          <FaUpload />
                          upload
                        </label>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          disabled
                        />
                        <p className='py-1 px-2 border flex gap-2 rounded items-center' >
                          <FaPencil />
                          Choose your own logo
                        </p>
                      </div>
                    </div>
                  </form>


                  <Button
                    className='cursor-pointer py-2 px-4 w-full mb-10  bg-[#533d64] hover:bg-[#815e9c] text-white transition-all duration-300'
                    onClick={handleAddToCart}
                  >Add to Cart</Button>
                </>
              }
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-center text-gray-500">No products available</p>
      )
      }
    </div >
  );
};

export default Uploadproductdetails;
