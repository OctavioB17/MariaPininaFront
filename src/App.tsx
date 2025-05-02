import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './components/landing/LandingPage'
import ProductDetails from './components/products/Details/ProductDetails'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import UserLogin from './components/users/UserLogin'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/products/:id' element={<ProductDetails/>}></Route>
        <Route path='/login' element={<UserLogin/>}/>
      </Routes>
    </>
  )
}

export default App
