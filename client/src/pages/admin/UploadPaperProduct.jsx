import { useGetAllPaperProductQuery, useUploadPaperProductMutation } from '@/redux/Postslice';
import { UploadIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Loading from '@/components/features/Loading';
import { toast } from 'react-toastify';

const UploadFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: 'paper-product',
    subcategory: 'document',
    price: '2',
    status: 'uncharacteroized'
  });

  const onDrop = (acceptedFiles) => {
    setFiles([acceptedFiles[0]]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': [],
      'image/jpeg': [],
      'image/png': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': []
    },
    maxSize: 10 * 1024 * 1024
  });

  const [uploadPaperProduct, { isError, isLoading }] = useUploadPaperProductMutation();

  const handleInputChange = (e) => {
    setError(null)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpload = async () => {
    if (!files[0]) return alert("Please select a file to upload");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.length === 0 || formData.name.length === 0) {
      setError("Please fill all the fields")
      return;
    }
    if (formData.price <= 1) {
      setError("Price should be greater than 1")
      return;
    }


    const file = files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'mero_sathi');

    try {
      setLoading(true)
      setError(null)
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/kesavyadav992/image/upload`,
        data
      );

      console.log(cloudinaryResponse);


      const imageUrl = cloudinaryResponse.data.secure_url;

      const response = await uploadPaperProduct({
        ...formData,
        image: imageUrl
      });

      if (response?.error?.message) {
        toast.error(response.error.message)
        setError(response?.error?.message)
      }
      console.log(response);
      
      toast.success(response.data.message)
      setFiles([]);
      setFormData({ name: '', category: 'paper-product', subcategory: 'document', price: '2', status: 'uncharacteroized' });
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.error("Error uploading product:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleClearQueue = () => setFiles([]);

  return isLoading ? <Loading /> :
    (
      <div className='px- lg:px-20 pt-10 pb-32 min-h-screen max-h-screen overflow-y-auto scrollbar-hide hidden md:block'>
        <h2 className="text-2xl font-bold mb-1 text-slate-600">Upload Files</h2>
        <p className="text-gray-600 text-sm mb-4">Please upload only one image for one product</p>

        <div
          {...getRootProps()}
          className="border-2 border-dashed hover:border-green-200 bg-green-50 rounded-lg p-10 text-center cursor-pointer hover:bg-green-100 transition-colors flex flex-col items-center py-20"
        >
          <input {...getInputProps()} />
          <p><UploadIcon size={50} className='text-slate-400 mb-2' /></p>
          <p className="text-green-600">Click to upload or drag and drop file here.</p>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            <li className="text-gray-700">
              {files[0].name} - {(files[0].size / 1024 / 1024).toFixed(2)} MB
            </li>
          </ul>
        )}

        <div className="mt-4 flex justify-between w-full">
          <button
            onClick={handleClearQueue}
            className="py-2 px-8 bg-red-200 text-red-600 rounded-lg hover:bg-red-300 transition-colors"
          >
            Clear queue
          </button>
          <button
            onClick={handleUpload}
            className="py-2 px-8 bg-[#008c3e] text-white rounded-lg transition-colors"
          >
            {isLoading ? "uploading" : "Upload"}
          </button>
        </div>

        <form className='mt-5 flex flex-col gap-3' onSubmit={handleSubmit}>
          <div className='flex flex-col lg:flex-row justify-between gap-5'>
            <div className='flex flex-col flex-1'>
              <label className='text-slate-700 font-semibold'>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                placeholder='product name'
                className='outline-none w-full py-2 px-2 border-gray-300 border-[0.1px] my-1 rounded-sm'
                onChange={handleInputChange}
              />
            </div>
            <div className='flex-1'>
              <label className='text-slate-700 font-semibold'>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded"
                required
              >
                <option value="paper-product">Paper Product</option>
              </select>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row justify-between gap-5'>
            <div className='flex flex-col flex-1'>
              <label className='text-slate-700 font-semibold'>Price</label>
              <input
                type="number"
                name="price"
                min={0}
                value={formData.price}
                placeholder='product price'
                className='outline-none w-full py-2 px-2 border-gray-300 border-[0.1px] my-1 rounded-sm'
                onChange={handleInputChange}
              />
            </div>
            <div className='flex-1'>
              <label className='text-slate-700 font-semibold'>Sub Category</label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded"
                required
              >
                <option value="document">Document</option>
                <option value="books-and-lab-Manual">Books and Lab Manual</option>
                <option value="thesis-and-dissertation">Thesis and Dissertation</option>
                <option value="photo-pictures">Photo Pictures</option>
                <option value="poster-printing">Poster Printing</option>
              </select>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row justify-between gap-5'>
            <div className='flex flex-col flex-1'>
              <label className='text-slate-700 font-semibold'>Optional</label>
              <input
                type="text"
                disabled
                placeholder='upcoming features'
                className='outline-none w-full py-2 px-2 border-gray-300 border-[0.1px] my-1 rounded-sm'
              />
            </div>
            <div className='flex-1'>
              <label className='text-slate-700 font-semibold'>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded"
                required
              >
                <option value="uncharacteroized">Uncharacterized</option>
                <option value="trending">Trending</option>
                <option value="newlaunched">New Launched</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
          {<span className='px-auto self-center text-red-500'>{error}</span>}
          <button className='w-full py-2 bg-[#008c3e] text-white rounded mt-1' type='submit'>{loading ? 'submiting' : "submint"} </button>
        </form>
      </div>
    );

};

export default UploadFiles;
