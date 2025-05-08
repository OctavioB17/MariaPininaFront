import { useEffect, useState } from 'react';
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter';
import { Box, Button, Checkbox, CircularProgress, Divider, Pagination } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../../config/variables';
import { IProduct } from '../../../interfaces/IProducts';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import NormalBox from '../../reusable/NormalBox';
import UserPublicationBox from './UserPublicationBox';

const UserPublicationsMenu = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [apiResponseLoading, setApiResponseLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set()); // Estado para los checkboxes seleccionados
  const limit = 30;

  useEffect(() => {
    const userProducts = async () => {
      setApiResponseLoading(true);
      try {
        const offset = (page - 1) * limit;
        const response: AxiosResponse<IPaginationResponse<IProduct>> = await axios.get(`${variables.backendIp}/products/get-all/user/${id}?limit=${limit}&offset=${offset}`);
        setProducts(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / limit));
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      } finally {
        setApiResponseLoading(false);
      }
    };

    userProducts();
  }, [id, page]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      const allProductIds = new Set(products.map(product => product.id));
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleCheckboxChange = (productId: string) => {
    const updatedSelectedProducts = new Set(selectedProducts);
    if (updatedSelectedProducts.has(productId)) {
      updatedSelectedProducts.delete(productId);
    } else {
      updatedSelectedProducts.add(productId);
    }
    setSelectedProducts(updatedSelectedProducts);
    setSelectAll(updatedSelectedProducts.size === products.length); // Actualiza el estado de selectAll
  };

  const isAnySelected = selectedProducts.size > 0;

  return (
    <NBoxWithHeaderAndFooter>
      <NormalBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1vw', marginTop: '1vw', marginBottom: '1vw' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Checkbox
            checked={selectAll}
            onChange={handleSelectAllChange}
            color='default'
            sx={{ fill: 'primary.contrastText', color: 'primary.contrastText' }}
          />
          <Box>
            <Button sx={{ color: 'inherit' }} disabled={!isAnySelected}>
              Pause
            </Button>
            <Button sx={{ color: 'inherit' }} disabled={!isAnySelected}>
              Activate
            </Button>
            <Button sx={{ color: 'inherit' }} disabled={!isAnySelected}>
              Edit
            </Button>
            <Button sx={{ color: 'inherit' }} disabled={!isAnySelected}>
              Delete
            </Button>
            <Button sx={{ color: 'inherit' }}>
              Create publication
            </Button>
          </Box>
        </Box>
        <Divider sx={{ border: '1px solid black', width: '100%' }} />
        {apiResponseLoading ? (
          <CircularProgress sx={{ color: 'primary.contrastText' }} />
        ) : (
          <Box sx={{ paddingTop: '1vw', paddingBottom: '1vw', width: '100%' }}>
            {products.map(product => (
              <UserPublicationBox
                key={product.id}
                product={product}
                isChecked={selectAll}
                onCheckboxChange={handleCheckboxChange} // Pasa la función para manejar el cambio del checkbox
              />
            ))}
          </Box>
        )}
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </NormalBox>
    </NBoxWithHeaderAndFooter>
  );
};

export default UserPublicationsMenu;