import { Box } from '@mui/material'
import React, { JSX, useEffect, useState } from 'react'
import NormalBox from '../reusable/NormalBox'
import Header from '../header/Header'
import { IProduct } from '../interfaces/products/IProducts'
import axios from 'axios'
import ProductsCarrousel from '../products/ProductsCarrousel'
import ProductCards from '../products/ProductCards'

const LandingPage: React.FC = (): JSX.Element => {
  
  const [products, setProducts] = useState<IProduct[]>([])
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<IProduct[]>('http://192.168.0.113:3000/api/v1/products/get-all/random')
        setProducts(response.data)
      } catch (error) {
        console.error('Error al traer los productos', error)
      }
    }

    fetchProducts()
  }, [])


  return (
    <Box>
        <NormalBox sx={{width: '90vw', padding: '1vw'}}>
          <Header products={products} sx={{borderBottom: '2px solid black'}}/>
          <Box sx={{}}>
            <ProductsCarrousel>
              { products.map(products => (
                <ProductCards id={products.id} productName={products.name} description={products.description} price={products.price} productImg={products.imageUrl}/>
              )) }
            </ProductsCarrousel>
          </Box>
        </NormalBox>
    </Box>  
  )
}

export default LandingPage