import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../ui/button';
import Loading from '../features/Loading';
import Card from '../services/Card';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from 'react-router-dom';

const AllProduct = () => {
  const [getAllProducts, setGetAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/admin/getAllProducts/?page=${page}&limit=${limit}&search=`,
        { withCredentials: true }
      );

      if (response?.data?.success) {
        setGetAllProducts(response?.data?.data || []);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when `page` or `limit` changes
  useEffect(() => {
    fetchAllProducts();
  }, [page, limit]);

  // Handle limit changes based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setLimit(8);
      } else {
        setLimit(15);
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="max-w-full min-h-screen mx-4 sm:mx-20 overflow-hidden gap-3 flex flex-col">
      <div>
        <img
          src="https://res.cloudinary.com/kesavyadav992/image/upload/v1736081419/nawbkesieqm6wqqkdj5q.jpg"
          alt=""
          className="w-full h-[400px] bg-cover overflow-hidden"
        />
      </div>
      <div>
        <div className="flex justify-between">
          <h2 className="text-xl xs:text-3xl font-bold text-slate-600 underline">All Products</h2>
          <div className="flex gap-3 items-center">
            {/* <p>#Nothing</p> */}
            {/* <Button 
            className="bg-[#533d64] hover:bg-[#5d3f74] transition-all duration-300 px-6"
            onClick={()=> Link('/allproduct/')}
            >
              Filter
            </Button> */}
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="sm:grid sm:grid-cols-2 flex flex-col items-center justify-center md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 my-5 gap-4">
              {getAllProducts.map((product, index) => (
                <Card key={product._id || product.id + index} item={product} />
              ))}
            </div>
            <div className="my-10 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => setPage(page - 1)}
                        className="cursor-pointer"
                      >
                        {page - 1}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(page)}
                      className="bg-slate-100 cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setPage(page + 1)}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((prev) => prev + 1)}
                      className="cursor-pointer"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllProduct;
