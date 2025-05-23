import { Box, Button, Pagination, CircularProgress } from '@mui/material';
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter';
import { ProductGridGalleryProps } from '../../interfaces/products/ProductGridGallery';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import FilterAndOrderProductGrid from './FilterAndOrderProductGrid';
import { variables } from '../../../config/variables';
import { useEffect, useState } from 'react';
import { IProduct } from '../../../interfaces/IProducts';
import axios from 'axios';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import ProductCards from '../Cards/ProductCards';
import notFoundImage from '../../../assets/notFound.webp';
import Cookies from 'js-cookie';

const ProductGridGallery: React.FC<ProductGridGalleryProps> = ({ filterBy }) => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 80;

  useEffect(() => {
    const getFilterValue = () => {
      const offset = (page - 1) * productsPerPage;
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const priceOrder = searchParams.get('priceOrder');
      const nameOrder = searchParams.get('nameOrder');
      const createdAt = searchParams.get('createdAt');

      let baseUrl = '';
      switch (filterBy) {
        case 'Category':
          baseUrl = `${variables.backendIp}/products/get-all/category/${params.categoryId}`;
          break;
        case 'Search':
          baseUrl = `${variables.backendIp}/products/get/name/${params.searchTerm}`;
          break;
        case 'User':
          baseUrl = `${variables.backendIp}/products/get-all/user/${params.userId}`;
          break;
        default:
          baseUrl = `${variables.backendIp}/products/get-all/random`;
      }

      const queryParams = new URLSearchParams();
      queryParams.set('limit', productsPerPage.toString());
      queryParams.set('offset', offset.toString());
      if (minPrice) queryParams.set('minPrice', minPrice);
      if (maxPrice) queryParams.set('maxPrice', maxPrice);
      if (priceOrder) queryParams.set('priceOrder', priceOrder);
      if (nameOrder) queryParams.set('nameOrder', nameOrder);
      if (createdAt) queryParams.set('createdAt', createdAt);

      return `${baseUrl}?${queryParams.toString()}`;
    };

    const fetchProducts = async () => {
      const token = Cookies.get('token') || ''
      setIsLoading(true);
      try {
        const response = await axios.get<IPaginationResponse<IProduct>>(getFilterValue(), {
          headers: {
            'Authorization': `Bearer ${Cookies.get(token)}`
          }
        });
        setProducts(response.data.data);
        if (response.data.data.length < productsPerPage) {
          setTotalPages(page);
        } else {
          setTotalPages(page + 1);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filterBy, params.searchTerm, params.userId, page, searchParams, params.categoryId]);

  useEffect(() => {
    setPage(1);
  }, [searchParams]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };
  
  return (
    <NBoxWithHeaderAndFooter sx={{width: '94vw'}}>
      <Box sx={{paddingTop: '2vw', paddingBottom: '2vw', display: 'flex'}}>
        <Box sx={{borderRight: '1px solid #0d3e45', paddingRight: '1vw'}}>
          <FilterAndOrderProductGrid />
        </Box>
        <Box sx={{ width: '100%' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
              <CircularProgress />
            </Box>
          ) : products.length > 0 ?
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
              <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '1vw',
                  paddingLeft: '1vw',
                  marginBottom: '2vw'
                }}>
                  {products.map((product) => (
                    <ProductCards key={product.id} product={product} sx={{width: '85%'}}/>
                  ))}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2vw' }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large" />
                </Box>
              </Box>
            :
              <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '2vw'}}>
                <Box component='img' src={notFoundImage} sx={{width: '30%', height: '100%'}}/>
                <Button variant='contained' onClick={() => navigate('/')} sx={{width: '35%', bgcolor: 'primary.contrastText', color: 'primary.main'}}>Go to Home</Button>
              </Box>
          }
        </Box>
      </Box>
    </NBoxWithHeaderAndFooter>
  )
}

export default ProductGridGallery