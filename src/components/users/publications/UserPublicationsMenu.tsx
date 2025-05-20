import { useEffect, useState, useCallback } from 'react';
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter';
import { Box, Button, Checkbox, CircularProgress, Divider, Pagination, Popper, Paper, TextField, MenuItem, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortOption, setSortOption] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const navigate = useNavigate();

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

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? 'filter-popper' : undefined;

  const applyFilters = async () => {
    let sortedProducts = [...products];

    if (sortOption === 'createdAt') {
      sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortOption === 'updatedAt') {
      sortedProducts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sortOption === 'name') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (minPrice !== '' || maxPrice !== '') {
      setApiResponseLoading(true);
      try {
        const response: AxiosResponse<IPaginationResponse<IProduct>> = await axios.get(`${variables.backendIp}/products/get-all/user/${id}`, {
          params: {
            minPrice: minPrice !== '' ? minPrice : undefined,
            maxPrice: maxPrice !== '' ? maxPrice : undefined,
            limit,
            offset: (page - 1) * limit,
          },
        });
        sortedProducts = response.data.data;
        setTotalPages(Math.ceil(response.data.data.length / limit));
      } finally {
        setApiResponseLoading(false);
      }
    }

    setProducts(sortedProducts);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (anchorEl && !anchorEl.contains(event.target as Node)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorEl]);

  return (
    <NBoxWithHeaderAndFooter>
      <NormalBox sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1vw', marginTop: '1vw', marginBottom: '1vw' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box>
            <Checkbox
            checked={selectAll}
            onChange={handleSelectAllChange}
            color='default'
            sx={{ fill: 'primary.contrastText', color: 'primary.contrastText' }}
          />
          <Button sx={{ color: 'inherit' }} onClick={handleFilterClick}>Filter</Button>
          </Box>
          <Box>
            <Button sx={{ color: 'inherit' }} disabled={!isPauseEnabled} onClick={togglePauseState}>
              Pause
            </Button>
            <Button sx={{ color: 'inherit' }} disabled={!isActivateEnabled} onClick={togglePauseState}>
              Activate
            </Button>
            <Button sx={{ color: 'inherit' }} disabled={!isEditEnabled} onClick={() => {
              const selectedProduct = Array.from(selectedProducts)[0];
              if (selectedProduct) {
                navigate(`/${id}/publications/edit/${selectedProduct.id}`);
              }
            }}>
              Edit
            </Button>
            <Button sx={{ color: 'inherit' }} disabled={!isAnySelected} onClick={deleteSelectedProducts}>
              Delete
            </Button>
            <Button sx={{ color: 'inherit' }} onClick={() => navigate(`/${id}/publications/create`)}>
              Create publication
            </Button>
          </Box>
        </Box>
        <Divider sx={{ border: '1px solid black', width: '100%' }} />
        {apiResponseLoading ? (
          <CircularProgress sx={{ color: 'primary.contrastText' }} />
        ) : (
          <Box sx={{ paddingTop: '1vw', paddingBottom: '1vw', width: '100%', display: 'flex', flexDirection: 'column', gap: '1vw' }}>
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
        <Popper id={popperId} open={open} anchorEl={anchorEl} placement="bottom-start">
          <Paper sx={{ border: '2px solid black', padding: '1rem', backgroundColor: 'primary.main', gap: '1rem' }}>
            <Typography>Sort by</Typography>
            <TextField
              select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem sx={{ color: 'primary.contrastText' }} value="createdAt">Newest</MenuItem>
              <MenuItem sx={{ color: 'primary.contrastText' }} value="updatedAt">Recently updated</MenuItem>
              <MenuItem sx={{ color: 'primary.contrastText' }} value="name">Alphabetically</MenuItem>
            </TextField>
            <Typography>Min Price</Typography>
            <TextField
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
              fullWidth
              margin="normal"
            />
            <Typography>Max Price</Typography>
            <TextField
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
              fullWidth
              margin="normal"
            />
            <Button sx={{ marginTop: '1rem' }} onClick={applyFilters} variant="contained" color="primary">
              Apply filters
            </Button>
          </Paper>
        </Popper>
      </NormalBox>
    </NBoxWithHeaderAndFooter>
  );
};

export default UserPublicationsMenu;