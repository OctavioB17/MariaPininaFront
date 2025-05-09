import { useEffect, useState, useCallback } from 'react';
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter';
import { Box, Button, Checkbox, CircularProgress, Divider, Pagination } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../../config/variables';
import { IProduct } from '../../../interfaces/IProducts';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import NormalBox from '../../reusable/NormalBox';
import UserPublicationBox from './UserPublicationBox';
import Cookies from 'js-cookie';

const UserPublicationsMenu = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [apiResponseLoading, setApiResponseLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<IProduct>>(new Set());
  const limit = 30;

  const userProducts = useCallback(async () => {
    setApiResponseLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response: AxiosResponse<IPaginationResponse<IProduct>> = await axios.get(`${variables.backendIp}/products/get-all/user/${id}?limit=${limit}&offset=${offset}`);
      setProducts(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / limit));
    } finally {
      setApiResponseLoading(false);
    }
  }, [id, page]);

  useEffect(() => {
    userProducts();
  }, [id, page, userProducts]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSelectAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      const allProducts = new Set(products);
      setSelectedProducts(allProducts);
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleCheckboxChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const updatedSelectedProducts = new Set(selectedProducts);
    if (updatedSelectedProducts.has(product)) {
      updatedSelectedProducts.delete(product);
    } else {
      updatedSelectedProducts.add(product);
    }
    setSelectedProducts(updatedSelectedProducts);
    setSelectAll(updatedSelectedProducts.size === products.length);
  };

  const updateProductPauseState = (productId: string, isPaused: boolean) => {
    setProducts(prevProducts => prevProducts.map(product =>
      product.id === productId ? { ...product, isPaused } : product
    ));
    setSelectedProducts(prevSelected => {
      const updatedSelected = new Set(prevSelected);
      const productToUpdate = Array.from(updatedSelected).find(p => p.id === productId);
      if (productToUpdate) {
        updatedSelected.delete(productToUpdate);
        updatedSelected.add({ ...productToUpdate, isPaused });
      }
      return updatedSelected;
    });
  };

  const isAnySelected = selectedProducts.size > 0;

  const isPauseEnabled = Array.from(selectedProducts).some(product => !product.isPaused);
  const isActivateEnabled = Array.from(selectedProducts).some(product => product.isPaused);
  const isEditEnabled = selectedProducts.size === 1;
    
  const togglePauseState = async () => {
    const selectedIds = Array.from(selectedProducts).map(product => product.id);
    setApiResponseLoading(true);
    try {
      const response = await axios.patch(
        `${variables.backendIp}/products/update/pause`,
        { ids: selectedIds },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      if (response.status === 200) {
        await userProducts();
        setSelectedProducts(new Set());
      }
    } finally {
      setApiResponseLoading(false);
    }
  };

  const deleteSelectedProducts = async () => {
    const selectedIds = Array.from(selectedProducts).map(product => product.id);
    setApiResponseLoading(true);
    try {
      const response = await axios.delete(
        `${variables.backendIp}/products/delete`,
        {
          data: { ids: selectedIds },
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
          },
        }
      );
      if (response.status === 200) {
        setProducts(prevProducts => prevProducts.filter(product => !selectedIds.includes(product.id)));
        setSelectedProducts(new Set());
      }
    } finally {
      setApiResponseLoading(false);
    }
  };

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
            <Button sx={{ color: 'inherit' }} disabled={!isPauseEnabled} onClick={togglePauseState}>
              Pause
            </Button>
            <Button sx={{ color: 'inherit' }} disabled={!isActivateEnabled} onClick={togglePauseState}>
              Activate
            </Button>
            <Button sx={{ color: 'inherit' }} disabled={!isEditEnabled}>
              Edit
            </Button>
            <Button sx={{ color: 'inherit' }} disabled={!isAnySelected} onClick={deleteSelectedProducts}>
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
                isChecked={selectedProducts.has(product)}
                onCheckboxChange={handleCheckboxChange}
                onPauseStateChange={updateProductPauseState}
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