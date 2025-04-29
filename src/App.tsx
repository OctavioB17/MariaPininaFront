import { Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './components/landing/LandingPage'
import ProductDetails from './components/products/Details/ProductDetails'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/products/:id' element={<ProductDetails/>}></Route>
      </Routes>
    </>
  )
}

export default App
