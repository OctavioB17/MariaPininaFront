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
  
    const filledProducts = [...products];
    const missingProducts = 5 - products.length;
  
    if (missingProducts > 0) {
      filledProducts.push(...Array.from({ length: missingProducts }, (_, index) => ({
        ...emptyProduct,
        id: `empty-${index}`,
      })));
    }
  
    return filledProducts.map(product => (
      <ProductCards key={product.id} product={product} />
    ));
  }, [products]);
  

  const randomCategories = useMemo(() => {
    if (categories.length === 0) {
      return [
        { id: "fake-1", name: "Claws and paws" },
        { id: "fake-2", name: "Fangs" },
        { id: "fake-3", name: "Pure tenderness" },
      ];
    }
  
    if (categories.length > 3) {
      return [...categories]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    }
  
    return categories;
  }, [categories]);
  


  const productCarouselsByCategory = useMemo(() => {
    return randomCategories.map(category => {
      const categoryProducts = products.filter(product => product.categoryId === category.id);
  
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
        categoryId: category.id,
        material: [],
        isPaused: false,
        userId: '',
        createdAt: '',
        updatedAt: '',
      };
  
      const missingProducts = 5 - categoryProducts.length;
  
      if (missingProducts > 0) {
        categoryProducts.push(
          ...Array.from({ length: missingProducts }, (_, index) => ({
            ...emptyProduct,
            id: `empty-${category.id}-${index}`,
          }))
        );
      }
  
      return (
        <Box key={category.id}>
          <Divider sx={{ border: '1px solid black' }} />
          <ProductsCarrousel carrouselName={category.name}>
            {categoryProducts.map(product => (
              <ProductCards key={product.id} product={product} />
            ))}
          </ProductsCarrousel>
        </Box>
      );
    });
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