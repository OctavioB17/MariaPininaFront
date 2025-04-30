import { Box, Divider } from '@mui/material'
import React, { JSX, useEffect, useMemo, useState } from 'react'
import { IProduct } from '../interfaces/products/IProducts'
import axios from 'axios'
import ProductsCarrousel from '../products/Cards/ProductsCarrousel'
import ProductCards from '../products/Cards/ProductCards'
import ICategory from '../interfaces/categories/ICategories'
import IPaginationResponse from '../interfaces/IPaginationResponse'
import { variables } from '../../config/variables'
import NBoxWithHeaderAndFooter from '../reusable/NBoxWithHeaderAndFooter'
const LandingPage: React.FC = (): JSX.Element => {
  
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
        thumbnailUrl: '',
        imageGallery: [],
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

  const randomCategories = useMemo(() => {
    if (categories.length > 3) {
      return [...categories]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3); 
    }
    return categories;
  }, [categories]);


  const productCarouselsByCategory = useMemo(() => {
    return randomCategories.map(category => (
      <Box>
        <Divider sx={{ border: '1px solid black' }}/>
        <ProductsCarrousel key={category.id} carrouselName={category.name}>
          {products
            .filter(product => product.categoryId === category.id)
            .map(filteredProduct => (
              <ProductCards key={filteredProduct.id} product={filteredProduct} />
            ))}
        </ProductsCarrousel>
      </Box>
    ));
  }, [randomCategories, products]);
  

  return (
    <Box>
        <NBoxWithHeaderAndFooter sx={{width: '90vw', padding: '1vw'}}>
            <ProductsCarrousel carrouselName='Products'>
              {memoizedProductCards}
            </ProductsCarrousel>
            <Box>
              {productCarouselsByCategory}
            </Box>
        </NBoxWithHeaderAndFooter>
    </Box>  
  )
}

export default LandingPage