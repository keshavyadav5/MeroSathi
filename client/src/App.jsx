import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Totop from './components/features/Totop'
import Header from './components/common/header/Header'
import Footer from './components/common/footer/Footer'
import Authlayout from './pages/auth/Authlayout'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import Home from './pages/home/Home'
import About from './pages/common/About'
import Contact from './pages/common/Contact'
import Loading from './components/features/Loading'
import Main from './pages/home/Main'
import VerifyEmail from './pages/auth/VerifyEmail'
import Profile from './pages/auth/Profile'
import PrivateAuth from './pages/auth/PrivateAuth'
import Private_Admin from './pages/admin/Private_Admin'
import Dashboard from './pages/admin/Dashboard'
import UploadPaperProduct from './pages/admin/UploadPaperProduct'
import Details from './pages/admin/Details'
import PrintPaperProduct from './components/user/paper-product/PrintPaperProduct'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Total_product from './pages/admin/total-user-products/Total_product'
import Total_user from './pages/admin/total-user-products/Total_user'
import UploadpaperproductDetails from './components/user/paper-product/UploadpaperproductDetails'
import Cart from './components/user/cart/Cart'
import UploadProduct from './pages/admin/UploadProduct'
import Uploadproductdetails from './components/user/product/Uploadproductdetails'


const App = () => {
  const [isLoading, setIsLoading] = useState(false)
  return !isLoading ? (
    <>
      <Totop />
      <Header />
      <Routes>
        <Route path='/' element={<Home />} >

          {/** Auth routes */}
          <Route path='/auth' element={<Authlayout />}>
            <Route path='signup' element={<Signup />} />
            <Route path='signin' element={<Login />} />
            <Route path='verify-email' element={<VerifyEmail />} />
          </Route>

          <Route path='' element={<Main />} />
          <Route path='about' element={<About />} />
          <Route path='contact' element={<Contact />} />
          <Route path='' element={<PrivateAuth />}>
            <Route path='profile' element={<Profile />} />
          </Route>

          {/** Admin routes */}
          <Route path='/admin' element={<Private_Admin />} >
            <Route path='dashboard' element={<Dashboard />} >
              <Route path='' element={<Details />} >
                <Route path='products' element={<Total_product />} />
                <Route path='users' element={<Total_user />} />
              </Route>
              <Route path='upload-paper-product' element={<UploadPaperProduct />} />
              <Route path='upload-product' element={<UploadProduct />} />
            </Route>
          </Route>

          {/** All Product Routes */}

          {/** User Features routes */}
          <Route path='print-paper-product/:category/:subcategory/:name' element={<PrintPaperProduct />} />
          <Route path='upload-paper-product-details' element={<UploadpaperproductDetails />} />
          <Route path='upload-product-details/:category/:subcategory/:name' element={<Uploadproductdetails />} />
          <Route path='/cart' element={<Cart />} />
        </Route>
      </Routes>
      <Footer />
      <ToastContainer position="top-right" autoClose={1000} />
    </>
  ) : <>
    <Loading isLoading={isLoading} />
  </>
}

export default App
