import { Box, Divider } from '@mui/material'
import React, { JSX, useEffect, useState } from 'react'
import NormalBox from './NormalBox'
import Header from '../Header/Header'
import { IProduct } from '../interfaces/products/IProducts'
import axios from 'axios'
import ICategory from '../interfaces/categories/ICategories'
import IPaginationResponse from '../interfaces/IPaginationResponse'
import { variables } from '../../config/variables'
import Footer from '../Footer/Footer'
import { SxPropWithChildren } from '../interfaces/SxProps'


const NBoxWithHeaderAndFooter: React.FC<SxPropWithChildren> = ({ children, sx }): JSX.Element => {
  
  const [products, setProducts] = useState<IProduct[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get<IProduct[]>(`${variables.backendIp}/products/get-all/random`),
          axios.get<IPaginationResponse<ICategory>>(`${variables.backendIp}/categories/get/all`)
        ])

        setProducts(productsResponse.data)
        setCategories(categoriesResponse.data.data)
      } catch (error) {
        console.error('Error al traer los productos', error)
      }
    }

    fetchProducts()
  }, [])


  return (
    <Box>
        <NormalBox sx={{...sx}}>
          <Header categories={categories} products={products} sx={{borderBottom: '2px solid black'}}/>
          <Box>
            {children}
          </Box>
          <Divider sx={{border: '1px solid black'}}/>
          <Footer/>
        </NormalBox>
    </Box>  
  )
}

export default NBoxWithHeaderAndFooter