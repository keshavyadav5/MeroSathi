import { Check, Search, UserIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { FaFemale } from 'react-icons/fa';
import { BiMale } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import { FaEquals } from "react-icons/fa";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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

import axios from 'axios';
import { toast } from 'react-toastify';
import { Cross1Icon } from '@radix-ui/react-icons';

const Total_user = () => {
  const [totalUsers, setTotalUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [idToDeleteUser, setIdToDeleteUser] = useState('');
  const navigate = useNavigate();

  const handleGetAllUsers = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/admin/getAllUsers/?page=${page}&limit=10&search=${search}`,{
          withCredentials : true
        }
      );

      if (response?.data?.success) {
        setTotalUsers(response?.data?.users);
        setPagination(response?.data?.pagination);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleGetAllUsers();
  }, [search, page]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URI}/api/auth/delete-user/${userId}`, {
        withCredentials: true
      });
      toast.success('User deleted successfully');
      handleGetAllUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setShowDeleteOption(false);
    }
  };

  return (
    <div className='w-full py hidden lg:block overflow-y-auto max-h-screen min-h-screen scrollbar-hide relative'>
      <div>
        {/** Overview: Total users and search box */}
        <div className='py-2'>
          <h3 className='text-slate-600 pb-1'>Overview</h3>
          <div className='grid grid-cols-4 gap-1 xl:flex xl:justify-between items-center'>
            <div className='flex items-center bg-orange-100 w-36 px-1 py-1 rounded-md gap-1'>
              <UserIcon size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold text-xl'>{pagination?.totalAdmin || 0}</h3>
                <p className='text-xs'>Admin</p>
              </div>
            </div>
            <div className='flex items-center bg-purple-100 w-36 px-1 py-1 rounded-md gap-1'>
              <BiMale size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold text-xl'>{pagination?.maleuser || 0}</h3>
                <p className='text-xs'>Male Users</p>
              </div>
            </div>
            <div className='flex items-center bg-purple-100 w-36 px-1 py-1 rounded-md gap-1'>
              <FaFemale size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold text-xl'>{pagination?.femaleuser || 0}</h3>
                <p className='text-xs'>Female Users</p>
              </div>
            </div>
            <div className='flex items-center bg-rose-100 w-36 px-1 py-1 rounded-md gap-1'>
              <FaEquals size={32} className='text-green-700 font-bold' />
              <div className='flex flex-col justify-center mb-1'>
                <h3 className='font-bold text-xl'>{pagination?.total || 0}</h3>
                <p className='text-xs'>Total Users</p>
              </div>
            </div>
          </div>

          <div className='bg-[#e3befe] my-4 py-2 rounded-md px-2 flex items-center justify-between'>
            <button
              className='cursor-pointer text-slate-700 hover:text-red-600 font-bold'
              onClick={() => navigate('/admin/dashboard/products')}
            >
              Users
            </button>
            <div className='flex items-center'>
              <input
                type="search"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
                className="xl:w-96 lg:w-80 h-10 rounded-l-sm outline-none px-2"
              />
              <div className='bg-blue-100 h-10 w-10 items-center flex justify-center rounded-r-full cursor-pointer'>
                <Search />
              </div>
            </div>
          </div>
        </div>

        {/** Users Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">S/N</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>isAdmin</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalUsers.map((item, index) => (
              <TableRow key={item?._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{item?.name}</TableCell>
                <TableCell>{item?.email}</TableCell>
                <TableCell className="text-right">
                  {item?.role === 'admin' ? (
                    <Check className='w-6 h-6 text-[#008c3e]' />
                  ) : (
                    <Cross1Icon className='w-6 h-6 text-red-700' />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <MdDelete
                    className='w-6 h-6 cursor-pointer text-red-700 hover:text-red-500 transition-all duration-300'
                    onClick={() => {
                      setShowDeleteOption(!showDeleteOption)
                      setIdToDeleteUser(item?._id)
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {
          showDeleteOption &&
          <div className='absolute top-80 right-80 left-40 bottom-0 z-50'>
            <Card className="w-[350px]">
              <CardHeader className='items-center flex flex-col'>
                <CardTitle className='text-xl font-bold'>You are about to delete a user</CardTitle>
                <CardDescription className='items-center flex flex-col'>
                  <p>This will delete the user from catalog.</p>
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
                  onClick={() => handleDeleteUser(idToDeleteUser)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          </div>
        }
      </div>

      {
        pagination.totalUsers >= 12 &&
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
      }
    </div>
  );
};

export default Total_user;
