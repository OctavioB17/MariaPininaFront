import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './components/landing/LandingPage'
import ProductDetails from './components/products/Details/ProductDetails'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import UserLogin from './components/users/auth/UserLogin'
import UserRegister from './components/users/auth/UserRegister'
import AuthInitializer from './components/users/auth/AuthInitializer'
import useIsLogged from './hooks/useIsLogged'
import useTokenRenewal from './hooks/useTokenRenewal'
import UserAccountAuthorization from './components/users/auth/UserAccountAuthorization'
import UserPasswordChange from './components/users/auth/UserPasswordChange'
import UserPasswordResetRequest from './components/users/auth/UserPasswordResetRequest'

function App() {

  const isLogged = useIsLogged()
  useTokenRenewal(isLogged);

  return (
    <>
      <AuthInitializer/>
      <Routes>
        <Route path='/' element={<LandingPage />}/>
        <Route path='/products/:id' element={<ProductDetails/>}/>
        {!isLogged && (
          <>
            <Route path='/login' element={<UserLogin />} />
            <Route path='/register' element={<UserRegister />} />
          </>
        )}
        <Route path='/authorize-user/:id' element={<UserAccountAuthorization/>}/>
        <Route path='/reset-password' element={<UserPasswordResetRequest/>}/>
        <Route path='/reset-password/reset' element={<UserPasswordChange/>}/>
        <Route path='*' element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App
