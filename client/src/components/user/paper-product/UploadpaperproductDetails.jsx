import React, { useEffect, useState } from 'react';
import { CiBookmarkCheck } from "react-icons/ci";
import { GiGrassMushroom } from "react-icons/gi";
import { IoTabletPortraitSharp } from "react-icons/io5";
import { MdCropLandscape } from "react-icons/md";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { paperProductPriceCalculation } from '@/components/features/Pricecalculation';
import { useAddPaperProductCartMutation } from '@/redux/AdminSlice';
import { toast } from 'react-toastify';
import Loading from '@/components/features/Loading';
import { useNavigate } from 'react-router-dom';

const UploadpaperproductDetails = () => {
  const navigate = useNavigate();
  const files = useSelector((state) => state.upload.files[0]);

  const [uploadData, setUploadData] = useState({
    category: '',
    subcategory: '',
    imageUrl: '',
    name: '',
    size: '',
    format: '',
    price: 0,
    pages: '',
    description: '...',
    copy: 1,
    papersize: '75gsmPaper',
    papertype: 'A4',
    binding: 'no-binding',
    printingside: 'single-side',
    orientation: 'portrait',
    printcolor: 'b&w',
  });

  const setOtherData = async () => {
    if (!files) return;
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/admin/getAllProducts/?page=1&limit=10&search=${files.name}`,
        { withCredentials: true }
      );
      setUploadData((prevData) => ({
        ...prevData,
        category: files.category,
        name: files.name,
        size: files.size,
        format: files.format,
        pages: files.pages,
        subcategory: files.subcategory,
        price: response?.data?.paperProducts[0]?.price || 0,
      }));
    } catch (error) {
      console.error("Error fetching data:", error.response);
    }
  };

  useEffect(() => {
    setOtherData();
  }, [files]);

  const total = paperProductPriceCalculation(uploadData);


  // add to cart 

  // const [addPaperProductCart, { isLoading, isError }] = useAddPaperProductCartMutation();

  // const handleAddToCart = async () => {
  //   try {
  //     const response = await addPaperProductCart(uploadData).unwrap();
  //     console.log(response);

  //     if (response.success) {
  //       toast.success('Paper product added to cart');
  //       navigate('/cart');
  //     } else {
  //       toast.error(response.message || 'Failed to add paper product to cart');
  //     }
  //   } catch (error) {
  //     toast.error('Not able to add to cart');
  //     console.error(error.message);
  //   }
  // };

  const handleAddToCart = async () => {
    try {
      const respose = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/user/add-cart-paperproduct`, {
        category : uploadData.category,
        subcategory : uploadData.subcategory,
        imageUrl : "imgurl",
        price : uploadData.price,
        name : uploadData.name,
        description : uploadData.description,
        pages : uploadData.pages,
        copy : uploadData.copy,
        size : uploadData.size,
        format : uploadData.format,
        papersize : uploadData.papersize,
        papertype : uploadData.papertype,
        binding : uploadData.binding,
        printingside : uploadData.printingside,
        orientation : uploadData.orientation,
        printcolor : uploadData.printcolor,
      }, {
        withCredentials: true
      })
     if(respose.data.success){
      toast.success('Paper product added to cart');
      navigate('/cart')
     }

    } catch (error) {
      toast.error(error?.response?.data?.message || "not able to add to cart")
      console.log(error.message);
    }
  }


  return (
    <div className='px-4 sm:px-20 pb-5'>
      <div>
        <div className='w-full h-44 bg-[#533d64] rounded-3xl flex justify-center items-center flex-col px-3 '>
          <h1 className="text-xl sm:text-3xl font-bold text-white py-4">`Upload Paper Product`</h1>
          <p className='max-w-[600px] text-white text-xs'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam ab id eos ipsam vitae porro quam debitis earum dolor accusantium, corporis, voluptatem ea. </p>
        </div>

        {/** Details that should be uploaded */}
        <div className='rounded-t-3xl my-5 shadow-md overflow-hidden'>
          <div className='w-full bg-[#894fb6] text-white flex items-center justify-center -5 py-3'>
            <CiBookmarkCheck /> <p>File / Pdf will be deleted after printed</p>
          </div>

          <div className='flex flex-col md:flex-row  p-4 py-10 gap-4'>

            {/** left side */}
            <div className='flex-1 flex flex-col gap-6'>
              <h2 className='text-3xl text-slate-700 font-bold'>Print Settings</h2>

              <div className='flex justify-between items-center'>
                <div>
                  <label className="block text-gray-700 text-sm font-bold">Copies</label>
                  <p className='text-sm text-slate-600'>Enter number of copies you need</p>
                </div>
                <input
                  type="number"
                  name="copy"
                  id="copy"
                  min={1}
                  max={25}
                  className='w-1/2 p-2 rounded-md text-slate-700 outline-none bg-[#e3befe]'
                  value={uploadData.copy}
                  onChange={(e) => setUploadData({ ...uploadData, copy: e.target.value })}
                />
              </div>
              <div className='flex justify-between items-center'>
                <div>
                  <label className="block text-gray-700 text-sm font-bold">Paper Type</label>
                  <p className='text-sm text-slate-600'>Choose type of printing paper</p>
                </div>
                <Select onValueChange={(value) => setUploadData({ ...uploadData, papertype: value })}>
                  <SelectTrigger className="w-1/2 bg-[#e3befe]">
                    <SelectValue placeholder="A4" />
                  </SelectTrigger>
                  <SelectContent className='bg-[#e3befe]'>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="A3">A3</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="A1">A1</SelectItem>
                    <SelectItem value="A0">A0</SelectItem>
                  </SelectContent>
                </Select>

              </div>
              <div className='flex justify-between items-center'>
                <div>
                  <label className="block text-gray-700 text-sm font-bold">Binding</label>
                  <p className='text-sm text-slate-600'>Check if you require binding</p>
                </div>
                <Select onValueChange={(value) => setUploadData({ ...uploadData, binding: value })}>
                  <SelectTrigger className="w-1/2 bg-[#e3befe]">
                    <SelectValue placeholder="No Binding" />
                  </SelectTrigger>
                  <SelectContent className='bg-[#e3befe]'>
                    <SelectItem value="no-binding">No Binding</SelectItem>
                    <SelectItem value="corner-stapling">Corner Stapling</SelectItem>
                    <SelectItem value="glue-tape-stable-binding">Glue tape staple Binding</SelectItem>
                    <SelectItem value="spiral-binding">Spiral Binding</SelectItem>
                    <SelectItem value="spiral-binding-with-harcover">Spiral Binding with hardcover</SelectItem>
                    <SelectItem value="wiro-binding">Wiro Binding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex justify-between items-center'>
                <div>
                  <label className="block text-gray-700 text-sm font-bold">Printing Side</label>
                  <p className='text-sm text-slate-600'>Choose the side you want to print</p>
                </div>
                <div className='flex gap-2'>
                  <div className='flex flex-col items-center'>
                    <button
                      onClick={() => setUploadData({ ...uploadData, printingside: 'single-side' })}
                      className={`w-16 h-16 border ${uploadData.printingside === 'single-side' ? 'bg-[#e3befe]' : ''} border-[#894fb6] flex items-center justify-center cursor-pointer rounded hover:bg-[#e3befe]`}>
                      <img src="https://cdn0.iconfinder.com/data/icons/printing-industry-1/512/Single_Sided_Printing-1024.png" alt="single side" className='w-6 h-6' />
                    </button>
                    <p className='text-xs mt-1 text-slate-500'>single side</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <button
                      onClick={() => setUploadData({ ...uploadData, printingside: 'double-side' })}
                      className={`w-16 h-16 border ${uploadData.printingside === 'double-side' ? 'bg-[#e3befe]' : ''} border-[#894fb6] flex items-center justify-center cursor-pointer rounded hover:bg-[#e3befe]`}>
                      <img src="https://th.bing.com/th/id/OIP.-sCbUmUY91BolI3TuDsRkwAAAA?rs=1&pid=ImgDetMain" alt="both side" className='w-6 h-6' />
                    </button>
                    <p className='text-xs mt-1 text-slate-500'>both side</p>
                  </div>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <div>
                  <label className="block text-gray-700 text-sm font-bold">Print Color</label>
                  <p className='text-sm text-slate-600'>Choose print color</p>
                </div>
                <div className='flex gap-2'>
                  <div className='flex flex-col items-center'>
                    <button
                      onClick={() => setUploadData({ ...uploadData, printcolor: 'b&w' })}
                      className={`w-16 h-16 border ${uploadData.printcolor === 'b&w' ? 'bg-[#e3befe]' : ""} border-[#894fb6] flex items-center justify-center cursor-pointer rounded `}>
                      <GiGrassMushroom size={20} />
                    </button>
                    <p className='text-xs mt-1 text-slate-500'>B&W</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <button
                      onClick={() => setUploadData({ ...uploadData, printcolor: 'color' })}
                      className={`w-16 h-16 ${uploadData.printcolor === 'color' ? 'bg-[#e3befe]' : ""} border border-[#894fb6] flex items-center justify-center cursor-pointer rounded `}>
                      <GiGrassMushroom size={20} className='text-green-600' />
                    </button>
                    <p className='text-xs mt-1 text-slate-500'>Color</p>
                  </div>
                </div>
              </div>

            </div>

            {/** Right */}
            <div className='flex-1 flex flex-col gap-6'>


              <div className='flex justify-between items-center'>
                <div>
                  <label className="block text-gray-700 text-sm font-bold">Orientation</label>
                  <p className='text-sm text-slate-600'>select orientation</p>
                </div>
                <div className='flex gap-2'>
                  <div className='flex flex-col items-center'>
                    <button
                      onClick={() => setUploadData({ ...uploadData, orientation: 'portrait' })}
                      className={`w-16 h-16 ${uploadData.orientation === 'portrait' ? 'bg-[#e3befe]' : ''} border border-[#894fb6] flex items-center justify-center cursor-pointer rounded`}>
                      <IoTabletPortraitSharp size={20} className='bg-white m-1' />
                    </button>
                    <p className='text-xs mt-1 text-slate-500'>Portrait</p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <button
                      onClick={() => setUploadData({ ...uploadData, orientation: 'landscape' })}
                      className={`w-16 h-16 ${uploadData.orientation === 'landscape' ? 'bg-[#e3befe]' : ''} border border-[#894fb6] flex items-center justify-center cursor-pointer rounded`}>
                      <MdCropLandscape size={20} className='bg-white m-1' />
                    </button>
                    <p className='text-xs mt-1 text-slate-500'>Landscape</p>
                  </div>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <div>
                  <label className="block text-gray-700 text-sm font-bold">Paper Size</label>
                  <p className='text-sm text-slate-600'>Choose size of printing paper</p>
                </div>
                <Select onValueChange={value => setUploadData({ ...uploadData, papersize: value })}>
                  <SelectTrigger className="w-1/2 bg-[#e3befe]">
                    <SelectValue placeholder="75GSM paper" />
                  </SelectTrigger>
                  <SelectContent className='bg-[#e3befe]'>
                    <SelectItem value="75gsm-paper">75GSM paper</SelectItem>
                    <SelectItem value="80gsm-paper">80GSM paper</SelectItem>
                    <SelectItem value="90gsm-bond-paper">90GSM bond paper</SelectItem>
                    <SelectItem value="100gsm-bond-paper">100GSM bond paper</SelectItem>
                    <SelectItem value="100gsm-paper">100GSM paper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Description</label>
                <textarea
                  name="description"
                  id="description"
                  placeholder='write description abour your project'
                  className='w-full outline-none border border-[#894fb6] p-2 rounded-sm'
                  rows={10}
                  value={uploadData.description}
                  onChange={e => setUploadData({ ...uploadData, description: e.target.value })}
                >
                </textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className='text-3xl font-bold text-slate-700'>File Preview</h2>
        <div className='mt-3 py-3 px-2 border border-[#533d64] w-[300px] bg-[#e9cafe] rounded-sm shadow-xl'>
          <p>Pages : <span className='font-bold text-[#533d64]'>{uploadData.pages}</span></p>
          <p>Copy : <span className='font-bold text-[#533d64]'>{uploadData.copy}</span></p>
          <p>Paper Type : <span className='font-bold text-[#533d64]'>{uploadData.papertype}</span></p>
          <p>Paper Size : <span className='font-bold text-[#533d64]'>{uploadData.papersize}</span></p>
          <p>Orientation : <span className='font-bold text-[#533d64]'>{uploadData.orientation}</span></p>
          <p>Print Color : <span className='font-bold text-[#533d64]'>{uploadData.printcolor}</span></p>
          <p>Binding Parts : <span className='font-bold text-[#533d64]'>{uploadData.binding}</span></p>
          <p>Print Side : <span className='font-bold text-[#533d64]'>{uploadData.printingside}</span></p>
          <p>Print Cost : Rs <span className='font-bold text-[#533d64]'>{uploadData.price}</span> /page</p>

          <h3 className='mt-4 text-xl font-semibold'>
            Total Amount : Rs <span className='text-green-800'>{`${total.toFixed(2)}`}</span>
          </h3>

          <Button
            className='mt-4 bg-[#533d64]'
            onClick={handleAddToCart}
          >Add Cart</Button>
        </div>
      </div>
    </div >
  )
}

export default UploadpaperproductDetails