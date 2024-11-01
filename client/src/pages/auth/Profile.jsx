import React, { useEffect, useState } from 'react';
import { Edit, Lock, MailPlus, PhoneCall, Save, SaveAll, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout, updateUserInfo, updateUserPassword } from '@/redux/AuthSlice';
import Loading from '@/components/features/Loading';

const Profile = () => {
  const [isUpdateInfo, setIsUpdateInfo] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser?.user?.name || '',
        email: currentUser?.user?.email || '',
        phone: currentUser?.user?.phone || '',
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswordData({ ...passwordData, [id]: value });
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/update/${currentUser?.user?._id}`,
        { name: formData.name, email: formData.email, phone: formData.phone },
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(updateUserInfo(response.data));
        setIsUpdateInfo(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/auth/update-password/${currentUser?.user?._id}`,
        { oldPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
        { withCredentials: true }
      );
      if (response.data.success) {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/api/auth/signout`);
        if (response.data.success) {
          dispatch(logout());
          navigate('/auth/signin');
        }
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return loading ? (
    <Loading isLoading={loading} />
  ) : (
    <div className='px-4 sm:px-20 flex justify-center'>
      <div className='w-full'>
        <div className='py-10'>
          <h2 className='text-3xl font-bold text-slate-700 pb-3'>Account Setting</h2>
          <p className='text-slate-500'>Manage your account information and preferences.</p>
        </div>

        <div className='flex flex-col md:flex-row items-center justify-between gap-5'>
          {/* Personal Info Form */}
          <div className='px-10 py-10 shadow-sm min-w-sm max-w-xl flex-1'>
            <h3 className='text-2xl font-bold text-slate-700 pb-1'>Personal Information</h3>
            <p className='text-slate-500 pb-5'>Update your name, email, and phone number.</p>
            <form className='flex flex-col gap-4' onSubmit={handleInfoSubmit}>
              <div>
                <label className='flex items-center gap-2 font-semibold pb-2 text-slate-600'><UserRound size={22} /> <p>Full Name</p></label>
                <input
                  className='w-full border-2 outline-none py-1 px-2 rounded-sm'
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isUpdateInfo}
                />
              </div>
              <div>
                <label className='flex items-center gap-2 font-semibold pb-2 text-slate-600'><MailPlus size={22} /> <p>Email</p></label>
                <input
                  className='w-full border-2 outline-none py-1 px-2 rounded-sm'
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isUpdateInfo}
                />
              </div>
              <div>
                <label className='flex items-center gap-2 font-semibold pb-2 text-slate-600'><PhoneCall size={22} /> <p>Phone number</p></label>
                <input
                  className='w-full border-2 outline-none py-1 px-2 rounded-sm'
                  type="number"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isUpdateInfo}
                />
                {error && <span className='text-red-500 text-sm'>{error}</span>}
              </div>

              <Button
                type={!isUpdateInfo ? 'submit' : 'button'}
                className='bg-[#008c3e] hover:bg-[#136939]'
                onClick={() => setIsUpdateInfo(!isUpdateInfo)}
              >
                {isUpdateInfo ? <><SaveAll /> Save Changes</> : <> <Edit /> Edit Info</>}
              </Button>
            </form>
          </div>

          {/* Password Form */}
          <div className='px-10 py-10 shadow-sm min-w-sm max-w-xl flex-1'>
            <h3 className='text-2xl font-bold text-slate-700 pb-1'>Password</h3>
            <p className='text-slate-500 pb-5'>Update your password to keep your account secure.</p>
            <form className='flex flex-col gap-4' onSubmit={handlePasswordSubmit}>
              <div>
                <label className='flex items-center gap-2 font-semibold pb-2 text-slate-600'><Lock size={22} /> <p>Current Password</p></label>
                <input
                  className='w-full border-2 outline-none py-1 px-2 rounded-sm'
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  placeholder='******************'
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <label className='flex items-center gap-2 font-semibold pb-2 text-slate-600'><Lock size={22} /> <p>New Password</p></label>
                <input
                  className='w-full border-2 outline-none py-1 px-2 rounded-sm'
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  placeholder='******************'
                  onChange={handlePasswordChange}
                />
              </div>
              <div>
                <label className='flex items-center gap-2 font-semibold pb-2 text-slate-600'><Lock size={22} /> <p>Confirm Password</p></label>
                <input
                  className='w-full border-2 outline-none py-1 px-2 rounded-sm'
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  placeholder='******************'
                  onChange={handlePasswordChange}
                />
                {passwordError && <span className='text-sm text-red-500'>{passwordError}</span>}
              </div>
              <Button type='submit' className='bg-[#008c3e] hover:bg-[#136939]'><Save /> Save Changes</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
