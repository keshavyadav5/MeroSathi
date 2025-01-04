import { useUploadProductMutation } from '@/redux/Postslice';
import { UploadIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Loading from '@/components/features/Loading';
import { toast } from 'react-toastify';

const productInfo = [
  { id: 1, category: 'gifts', subcategory: 'personalised_gift' },
  { id: 2, category: 'gifts', subcategory: 'corporate_gift' },
  { id: 3, category: 'gifts', subcategory: 'wedding_gift' },
  { id: 4, category: 'gifts', subcategory: 'birthday_gift' },
  { id: 5, category: 'gifts', subcategory: 'anniversary_gift' },
  { id: 6, category: 'stationary', subcategory: 'office_stationary' },
  { id: 7, category: 'stationary', subcategory: 'school_stationary' },
  { id: 8, category: 'marketing', subcategory: 'marketing_materials(flex)' },
  { id: 9, category: 'marketing', subcategory: 'marketing_materials(paper)' },
  { id: 10, category: 'event_merchandise', subcategory: 'products' },
]

const UploadProduct = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    status: 'uncharacterized',
    stock: '',
    type: 'undefined',
    description: '',
  });

  const onDrop = (acceptedFiles) => {
    if (files.length + acceptedFiles.length > 4) {
      toast.error("You can upload a maximum of 4 images.");
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: 10 * 1024 * 1024,
  });

  const [uploadProduct, { isError, isLoading }] = useUploadProductMutation();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpload = async () => {
    if (files.length < 1) {
      toast.error("Please upload at least one image.");
      return;
    }

    setLoading(true);
    const uploadedImages = [];
    try {
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'mero_sathi');

        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/kesavyadav992/image/upload`,
          data
        );

        uploadedImages.push(cloudinaryResponse.data.secure_url);
      }

      console.log(formData, uploadedImages);


      const response = await uploadProduct({
        ...formData,
        images: uploadedImages,
      });

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Error uploading product.");
    } finally {
      setFiles([]);
      setFormData({
        name: '',
        category: '',
        subcategory: '',
        price: '',
        status: 'uncharacterized',
        stock: '',
        type: 'undefined',
        description: '',
      });
      setLoading(false);
    }
  };

  const filteredSubcategories = productInfo.filter(
    (info) => info.category === formData.category
  );
  const handleClearQueue = () => setFiles([]);

  return isLoading ? (
    <Loading />
  ) : (
    <div className="px- lg:pl-20 pt-10 pb-32 min-h-screen max-h-screen overflow-y-auto scrollbar-hide hidden md:block">
      <h2 className="text-2xl font-bold mb-1 text-slate-600">Upload Files</h2>
      <p className="text-gray-600 text-sm mb-4">
        Please upload at least one and at most four images for one product.
      </p>

      <div
        {...getRootProps()}
        className="border-2 border-dashed hover:border-green-200 bg-green-50 rounded-lg p-10 text-center cursor-pointer hover:bg-green-100 transition-colors flex flex-col items-center py-20"
      >
        <input {...getInputProps()} />
        <p>
          <UploadIcon size={50} className="text-slate-400 mb-2" />
        </p>
        <p className="text-green-600">Click to upload or drag and drop files here.</p>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li key={index} className="text-gray-700">
              {file.name} - {(file.size / 1024 / 1024).toFixed(2)} MB
            </li>
          ))}
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
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <form className="mt-5 flex flex-col gap-3" onSubmit={handleUpload}>
        <div className='flex flex-col lg:flex-row justify-between gap-5'>
          <div className='flex-1 flex flex-col'>
            <label className='text-slate-700 font-semibold'>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded"
              required
            >
              <option value=""></option>
              {Array.from(new Set(productInfo.map((info) => info.category))).map(
                (category, index) => (
                  <option key={index} value={category}>
                    {
                      `${category}`.replace('_', ' ').charAt(0).toUpperCase()
                      +
                      `${category}`.replace('_', ' ').slice(1)
                    }
                  </option>
                )
              )}
            </select>
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
            <option value=""></option>
              {filteredSubcategories.map((info, index) => (
                <option key={index} value={info.subcategory}>
                  {
                    `${info.subcategory}`.replace('_', ' ').charAt(0).toUpperCase()
                    + `${info.subcategory}`.replace('_', ' ').slice(1)
                  }
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row justify-between gap-5'>
          <div className='flex flex-col flex-1'>
            <label className='text-slate-700 font-semibold'>Name</label>
            <input
              type="text"
              placeholder='Name'
              value={formData.name}
              name="name"
              onChange={handleInputChange}
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
              <option value="uncharacterized">Uncharacterized</option>
              <option value="trending">Trending</option>
              <option value="newlaunched">New Launched</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>
        </div>

        <div className='flex flex-col lg:flex-row justify-between gap-5'>
          <div className='flex-1 flex flex-col gap-3'>
            <div>
              <label className='text-slate-700 font-semibold'>Stock</label>
              <input
                type="number"
                min={0}
                placeholder='Stock'
                value={formData.stock}
                name="stock"
                onChange={handleInputChange}
                className='outline-none w-full py-2 px-2 border-gray-300 border-[0.1px] my-1 rounded-sm'
              />
            </div>
            <div>
              <label className='text-slate-700 font-semibold'>Price</label>
              <input
                type="number"
                name="price"
                min={0}
                value={formData.price}
                placeholder='Product price'
                className='outline-none w-full py-2 px-2 border-gray-300 border-[0.1px] my-1 rounded-sm'
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className='text-slate-700 font-semibold'>Types</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-2 my-1 outline-none border-[0.1px] border-gray-300 rounded"
                required
              >
                <option value="undefined">undefined</option>
                <option value="glass">Glass</option>
                <option value="stationary">Stationary</option>
                <option value="tshirt">T-shirt</option>
                <option value="sweeter">Sweeter</option>
              </select>
            </div>
          </div>
          <div className='flex flex-col flex-1'>
            <label className='text-slate-700 font-semibold'>Description</label>
            <textarea
              name="description"
              rows={8}
              value={formData.description}
              placeholder='Use dot(.) to terminate sentence'
              className='outline-none w-full py-2 px-2 border-gray-300 border-[0.1px] my-1 rounded-sm'
              onChange={handleInputChange}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default UploadProduct;