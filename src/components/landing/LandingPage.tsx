import { Box } from '@mui/material'
import React, { JSX, useEffect, useMemo, useState } from 'react'
import NormalBox from '../reusable/NormalBox'
import Header from '../header/Header'
import { IProduct } from '../interfaces/products/IProducts'
import axios from 'axios'
import ProductsCarrousel from '../products/Cards/ProductsCarrousel'
import ProductCards from '../products/Cards/ProductCards'

const LandingPage: React.FC = (): JSX.Element => {
  
  const [products, setProducts] = useState<IProduct[]>([])
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<IProduct[]>('http://192.168.0.14:3000/api/v1/products/get-all/random')
        setProducts(response.data)
      } catch (error) {
        console.error('Error al traer los productos', error)
      }
    }

    fetchProducts()
  }, [])

  const memoizedProductCards = useMemo(() => {
    if (products.length > 0) {
      return products.map(product => (
        <ProductCards key={product.id} product={product} />
      ));
    } else {

      const emptyProduct: IProduct = {
        id: '0',
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        sku: '',
        length: 0,
        width: 0,
        height: 0,
        stock: 0,
        categoryId: '',
        material: [],
        isPaused: false,
        userId: '',
        createdAt: '',
        updatedAt: '',
      };
      return Array.from({ length: 5 }).map((_, index) => (
        <ProductCards key={index} product={emptyProduct} />
      ));
    }
  }, [products]);

  return (
    <Box>
        <NormalBox sx={{width: '90vw', padding: '1vw'}}>
          <Header products={products} sx={{borderBottom: '2px solid black'}}/>
          <Box sx={{}}>
            <ProductsCarrousel>
              {memoizedProductCards}
            </ProductsCarrousel>
          </Box>
        </NormalBox>
    </Box>  
  )
}

export default LandingPage