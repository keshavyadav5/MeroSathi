import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import Loading from "../features/Loading";
import Card from "../services/Card";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const AllProductCatogory = () => {
  const [getAllProducts, setGetAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParam = (param) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  const query = getQueryParam("q");

  useEffect(() => {
    setSearch(query || ""); // Set initial search value from URL
  }, [location]);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/admin/getAllProducts/?page=${page}&limit=${limit}&search=${search}`,
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

  // Fetch products when `page`, `limit`, or `search` changes
  useEffect(() => {
    fetchAllProducts();
  }, [page, limit, search]);

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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    setSearchData(e.target.value); // Update local search input state
  };

  const searchProducts = (query) => {
    setSearch(query); // Update search state
    navigate(`?q=${query}`); // Update the query parameter in the URL
  };

  return (
    <>
      <div className="sm:mx-20 ">
        <img
          src="https://res.cloudinary.com/kesavyadav992/image/upload/v1736081419/nawbkesieqm6wqqkdj5q.jpg"
          alt=""
          className="w-full h-[400px] bg-cover overflow-hidden"
        />
      </div>
      <div className="max-w-full min-h-screen mt-6 mx-4 sm:mx-20 overflow-hidden gap-3 flex flex-col">

        <div>
          <div className="flex justify-between">
            <h2 className="text-xl xs:text-3xl font-bold text-slate-600 underline">
              #{search || "All Products"}
            </h2>
            <div className="flex items-center">
              <input
                type="search"
                className="outline-none border-2 px-2 py-1 rounded-l-sm"
                autoFocus
                value={searchData}
                id="searchData"
                onChange={handleChange}
              />
              <Search
                className="w-6 h-9 px-1 text-white bg-[#b879e8] rounded-r-xl cursor-pointer"
                onClick={() => searchProducts(searchData)}
              />
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
    </>
  );
};

export default AllProductCatogory;
