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
            <Route path='dashboard' element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </>
  ) : <>
    <Loading isLoading={isLoading} />
  </>
}

export default App
