import { useEffect, useState, useCallback } from 'react';
import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter';
import { Box, Button, Checkbox, CircularProgress, Divider, Pagination, Menu, TextField, MenuItem, Typography, useMediaQuery } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../../config/variables';
import { IProduct, IProductWithUserAndCategory } from '../../../interfaces/IProducts';
import IPaginationResponse from '../../interfaces/IPaginationResponse';
import NormalBox from '../../reusable/NormalBox';
import UserPublicationBox from './UserPublicationBox';
import Cookies from 'js-cookie';
import { theme } from '../../../config/ThemeConfig';

const UserPublicationsMenu = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = useParams();
  const [products, setProducts] = useState<IProductWithUserAndCategory[]>([]);
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
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const navigate = useNavigate();

  const userProducts = useCallback(async () => {
    setApiResponseLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response: AxiosResponse<IPaginationResponse<IProductWithUserAndCategory>> = await axios.get(`${variables.backendIp}/products/get-all/user/${id}?limit=${limit}&offset=${offset}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`
        }
      });
      
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

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest('.MuiMenu-root')) {
      return;
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? 'filter-popper' : undefined;

  const applyFilters = async () => {
      setApiResponseLoading(true);
      try {
      interface FilterParams {
        limit: number;
        offset: number;
        min_price?: number;
        max_price?: number;
        categoryId?: string;
      }

      const params: FilterParams = {
            limit,
        offset: (page - 1) * limit
      };

      if (minPrice !== '') {
        params.min_price = minPrice;
      }
      if (maxPrice !== '') {
        params.max_price = maxPrice;
      }
      if (selectedCategory !== '') {
        params.categoryId = selectedCategory;
      }

      const response: AxiosResponse<IPaginationResponse<IProductWithUserAndCategory>> = await axios.get(
        `${variables.backendIp}/products/get-all/user/${id}`,
        {
          params,
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`
          }
        }
      );

      const sortedProducts = response.data.data;

      switch (sortOption) {
        case 'createdAt':
          sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'updatedAt':
          sortedProducts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          break;
        case 'name':
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
    }

    setProducts(sortedProducts);
      setTotalPages(Math.ceil(response.data.data.length / limit));
      setAnchorEl(null);
    } finally {
      setApiResponseLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popperElement = document.getElementById(popperId || '');
      if (anchorEl && 
          !anchorEl.contains(event.target as Node) && 
          popperElement && 
          !popperElement.contains(event.target as Node)) {
        setAnchorEl(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorEl, popperId]);

  return (
    <NBoxWithHeaderAndFooter>
      <NormalBox sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: isMobile ? '4vw' : '1vw', 
        marginTop: isMobile ? '4vw' : '1vw', 
        marginBottom: isMobile ? '4vw' : '1vw' 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          width: '100%',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '4vw' : '0'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '4vw' : '1vw',
            width: isMobile ? '100%' : 'auto',
            justifyContent: isMobile ? 'space-between' : 'flex-start'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={selectAll}
                onChange={handleSelectAllChange}
                color='default'
                sx={{ 
                  fill: 'primary.contrastText', 
                  color: 'primary.contrastText',
                  transform: isMobile ? 'scale(1.5)' : 'scale(1)'
                }}
              />
              <Button 
                sx={{ 
                  color: 'inherit',
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }} 
                onClick={handleFilterClick}
              >
                Filter
              </Button>
            </Box>
          </Box>
          <Box sx={{
            display: 'flex',
            gap: isMobile ? '2vw' : '1vw',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            justifyContent: isMobile ? 'center' : 'flex-end',
            width: isMobile ? '100%' : 'auto'
          }}>
            <Button 
              sx={{ 
                color: 'inherit',
                fontSize: isMobile ? '4vw' : 'inherit',
                padding: isMobile ? '2vw' : 'inherit'
              }} 
              disabled={!isPauseEnabled} 
              onClick={togglePauseState}
            >
              Pause
            </Button>
            <Button 
              sx={{ 
                color: 'inherit',
                fontSize: isMobile ? '4vw' : 'inherit',
                padding: isMobile ? '2vw' : 'inherit'
              }} 
              disabled={!isActivateEnabled} 
              onClick={togglePauseState}
            >
              Activate
            </Button>
            <Button 
              sx={{ 
                color: 'inherit',
                fontSize: isMobile ? '4vw' : 'inherit',
                padding: isMobile ? '2vw' : 'inherit'
              }} 
              disabled={!isEditEnabled} 
              onClick={() => {
                const selectedProduct = Array.from(selectedProducts)[0];
                if (selectedProduct) {
                  navigate(`/${id}/publications/edit/${selectedProduct.id}`);
                }
              }}
            >
              Edit
            </Button>
            <Button 
              sx={{ 
                color: 'inherit',
                fontSize: isMobile ? '4vw' : 'inherit',
                padding: isMobile ? '2vw' : 'inherit'
              }} 
              disabled={!isAnySelected} 
              onClick={deleteSelectedProducts}
            >
              Delete
            </Button>
            <Button 
              sx={{ 
                color: 'inherit',
                fontSize: isMobile ? '4vw' : 'inherit',
                padding: isMobile ? '2vw' : 'inherit'
              }} 
              onClick={() => navigate(`/${id}/publications/create`)}
            >
              Create publication
            </Button>
          </Box>
        </Box>
        <Divider sx={{ 
          border: '1px solid #0d3e45', 
          width: '100%',
          marginTop: isMobile ? '4vw' : '1vw',
          marginBottom: isMobile ? '4vw' : '1vw'
        }} />
        {apiResponseLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%', 
            padding: isMobile ? '40vw' : '20vw' 
          }}>
            <CircularProgress sx={{ color: 'primary.contrastText' }} />
          </Box>
        ) : (
          <Box sx={{ 
            paddingTop: isMobile ? '4vw' : '1vw', 
            paddingBottom: isMobile ? '4vw' : '1vw', 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: isMobile ? '4vw' : '1vw' 
          }}>
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
          sx={{
            '& .MuiPaginationItem-root': {
              fontSize: isMobile ? '4vw' : 'inherit',
              padding: isMobile ? '2vw' : 'inherit'
            }
          }}
        />
        <Menu
          id={popperId}
          open={open}
          anchorEl={anchorEl}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          PaperProps={{
            sx: {
              width: isMobile ? '90vw' : 'auto',
              maxHeight: isMobile ? '80vh' : 'auto'
            }
          }}
        >
          <Box sx={{ padding: isMobile ? '4vw' : '1rem' }}>
            <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Sort by</Typography>
            <TextField
              select
              value={sortOption}
              onChange={(e) => {
                e.stopPropagation();
                setSortOption(e.target.value);
              }}
              slotProps={{
                select: {
                  MenuProps: {
                    disablePortal: true,
                    onClose: (e: React.MouseEvent) => e.stopPropagation()
                  }
                }
              }}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }
              }}
            >
              <MenuItem 
                sx={{ 
                  color: 'primary.contrastText',
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }} 
                value="createdAt"
                onClick={(e) => e.stopPropagation()}
              >
                Newest
              </MenuItem>
              <MenuItem 
                sx={{ 
                  color: 'primary.contrastText',
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }} 
                value="updatedAt"
                onClick={(e) => e.stopPropagation()}
              >
                Recently updated
              </MenuItem>
              <MenuItem 
                sx={{ 
                  color: 'primary.contrastText',
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }} 
                value="name"
                onClick={(e) => e.stopPropagation()}
              >
                Alphabetically
              </MenuItem>
            </TextField>
            <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Category</Typography>
            <TextField
              select
              value={selectedCategory}
              onChange={(e) => {
                e.stopPropagation();
                setSelectedCategory(e.target.value);
              }}
              slotProps={{
                select: {
                  MenuProps: {
                    disablePortal: true,
                    onClose: (e: React.MouseEvent) => e.stopPropagation()
                  }
                }
              }}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }
              }}
            >
              <MenuItem 
                sx={{ 
                  color: 'primary.contrastText',
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }} 
                value=""
                onClick={(e) => e.stopPropagation()}
              >
                All Categories
              </MenuItem>
              {Array.from(new Set(products.map(product => product.categories.id))).map(categoryId => {
                const category = products.find(p => p.categories.id === categoryId)?.categories;
                return category ? (
                  <MenuItem 
                    key={categoryId}
                    sx={{ 
                      color: 'primary.contrastText',
                      fontSize: isMobile ? '4vw' : 'inherit',
                      padding: isMobile ? '2vw' : 'inherit'
                    }} 
                    value={categoryId}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {category.name}
                  </MenuItem>
                ) : null;
              })}
            </TextField>
            <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Min Price</Typography>
            <TextField
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }
              }}
            />
            <Typography sx={{ fontSize: isMobile ? '4vw' : 'inherit' }}>Max Price</Typography>
            <TextField
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-input': {
                  fontSize: isMobile ? '4vw' : 'inherit',
                  padding: isMobile ? '2vw' : 'inherit'
                }
              }}
            />
            <Button 
              sx={{ 
                marginTop: isMobile ? '4vw' : '1rem',
                fontSize: isMobile ? '4vw' : 'inherit',
                padding: isMobile ? '2vw' : 'inherit'
              }} 
              onClick={applyFilters} 
              variant="contained" 
              color="primary"
            >
              Apply filters
            </Button>
          </Box>
        </Menu>
      </NormalBox>
    </NBoxWithHeaderAndFooter>
  );
};

export default UserPublicationsMenu;