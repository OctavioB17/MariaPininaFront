import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './components/landing/LandingPage'
import ProductDetails from './components/products/Details/ProductDetails'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import UserLogin from './components/users/UserLogin'
import UserRegister from './components/users/UserRegister'
import UserAccountAuthorization from './components/users/UserAccountAuthorization'
import UserPasswordResetRequest from './components/users/UserPasswordResetRequest'
import UserPasswordChange from './components/users/UserPasswordChange'
import AuthInitializer from './components/users/AuthInitializer'
import useIsLogged from './hooks/useIsLogged'
import useTokenRenewal from './hooks/useTokenRenewal'

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
