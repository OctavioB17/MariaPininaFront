import { Box, Divider } from '@mui/material'
import React, { JSX, useEffect, useState } from 'react'
import NormalBox from './NormalBox'
import Header from '../Header/Header'
import axios from 'axios'
import ICategory from '../../interfaces/ICategories'
import IPaginationResponse from '../interfaces/IPaginationResponse'
import { variables } from '../../config/variables'
import Footer from '../Footer/Footer'
import { SxPropWithChildren } from '../interfaces/SxProps'
import { IProduct } from '../../interfaces/IProducts'


const NBoxWithHeaderAndFooter: React.FC<SxPropWithChildren> = ({ children, sx }): JSX.Element => {
  
  const [products, setProducts] = useState<IProduct[]>([])
  const [categories, setCategories] = useState<ICategory[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {

        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get<IPaginationResponse<IProduct>>(`${variables.backendIp}/products/get-all/random`),
          axios.get<IPaginationResponse<ICategory>>(`${variables.backendIp}/categories/get/all`)
        ])

        setProducts(productsResponse.data.data)
        setCategories(categoriesResponse.data.data)
      } catch (error) {
        console.error('Error al traer los productos', error)
      }
    }

    fetchProducts()
  }, [])


  return (
    <Box>
        <NormalBox sx={{width: '90vw', border: '0', ...sx}}>
          <Header categories={categories} products={products} sx={{borderBottom: '2px solid #0d3e45'}}/>
          <Box>
            {children}
          </Box>
          <Divider sx={{border: '1px solid #0d3e45'}}/>
          <Footer/>
        </NormalBox>
    </Box>  
  )
}

export default NBoxWithHeaderAndFooter