import { Box, Divider } from '@mui/material'
import React, { JSX, useEffect, useMemo, useState } from 'react'
import { IProduct } from '../../interfaces/IProducts'
import axios from 'axios'
import ProductsCarrousel from '../products/Cards/ProductsCarrousel'
import ProductCards from '../products/Cards/ProductCards'
import ICategory from '../../interfaces/ICategories'
import IPaginationResponse from '../interfaces/IPaginationResponse'
import { variables } from '../../config/variables'
import NBoxWithHeaderAndFooter from '../reusable/NBoxWithHeaderAndFooter'
import CategoryCardCarrousel from '../Categories/CategoryCardCarrousel'
import CategoryCard from '../Categories/CategoryCard'
import defaultImage from '../../assets/ChatGPT Image 27 may 2025, 15_29_19.png';
import heroImage from '../../assets/hero.webp';
import { useNavigate } from 'react-router-dom'

const LandingPage: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
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
        console.error('Error to get products and categories', error)
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

  const fakeCategories = useMemo(() => [
    {
      id: "fake-1",
      name: "Claws and paws",
      description: 'A collection dedicated to all creatures that roam the world on four legs...',
      imageUrl: '',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: "fake-2",
      name: "Fangs",
      description: "A category that highlights nature's most fearsome and fascinating predators...",
      imageUrl: '',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: "fake-3",
      name: "Pure tenderness",
      description: 'A heartwarming selection filled with the most adorable, gentle, and loving beings...',
      imageUrl: '',
      createdAt: '',
      updatedAt: '',
    }
  ], []);

  const randomCategories = useMemo(() => {
    const emptyCategory: ICategory = {
      id: '',
      name: '',
      description: '',
      imageUrl: '',
      createdAt: '',
      updatedAt: '',
    };

    if (categories.length >= 3) {
      return [...categories].sort(() => Math.random() - 0.5).slice(0, 3);
    }

    const needed = 3 - categories.length;
    const shuffledFakes = [...fakeCategories].sort(() => Math.random() - 0.5);
    const selectedFakes = shuffledFakes.slice(0, needed);

    return [
      ...categories.map((cat) => ({
        ...emptyCategory,
        ...cat,
      })),
      ...selectedFakes
    ];
  }, [categories, fakeCategories]);
  
  const MemoizedCategoryCards = useMemo(() => {
    const emptyCategory: ICategory = {
      id: 'empty',
      name: '',
      imageUrl: '',
      description: '',
      createdAt: '',
      updatedAt: '',
    };
  
    const filledCategories = [...randomCategories];
    const missingCount = 3 - filledCategories.length;
  
    if (missingCount > 0) {
      filledCategories.push(
        ...Array.from({ length: missingCount }, (_, i) => ({
          ...emptyCategory,
          id: `empty-${i}`,
        }))
      );
    }
  
    return (
      <CategoryCardCarrousel carrouselName={'Categories'}>
        {filledCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </CategoryCardCarrousel>
    );
  }, [randomCategories]);

  const productCarouselsByCategory = useMemo(() => {
    return randomCategories.map(category => {
      const categoryProducts = products.filter(product => product.categoryId === category.id);
  
      const emptyProduct: IProduct = {
        id: '0',
        name: '',
        description: '',
        price: 0,
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
          <Divider sx={{ border: '1px solid #0d3e45' }} />
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
            <Box 
              component='img' 
              alt='Hero' 
              src={heroImage} 
              sx={{
                width: '100%',
                height: '30vw',
                objectFit: 'cover',
                borderBottom: '2px solid #0d3e45',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => {
                navigate('/products');
              }}
            />
            <ProductsCarrousel carrouselName='Products'>
              {memoizedProductCards}
            </ProductsCarrousel>
            <Divider sx={{border: '1px solid #0d3e45'}}/>
            {MemoizedCategoryCards}
            <Box>
              {productCarouselsByCategory}
            </Box>
        </NBoxWithHeaderAndFooter>
    </Box>  
  )
}

export default LandingPage