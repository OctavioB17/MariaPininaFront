import React, { useState } from 'react';
import { Box, Typography, Slider, FormControl, Select, MenuItem, SelectChangeEvent, Button, TextField, SwipeableDrawer, useMediaQuery, useTheme, IconButton } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterAndOrderProductGrid = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<number[]>([0, 999999]);
  const [priceOrder, setPriceOrder] = useState<string>('');
  const [nameOrder, setNameOrder] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');

  const handlePriceChange = (_event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 999999;
    setPriceRange([priceRange[0], value]);
  };

  const handlePriceOrderChange = (event: SelectChangeEvent) => {
    setPriceOrder(event.target.value);
  };

  const handleNameOrderChange = (event: SelectChangeEvent) => {
    setNameOrder(event.target.value);
  };

  const handleCreatedAtChange = (event: SelectChangeEvent) => {
    setCreatedAt(event.target.value);
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('minPrice', priceRange[0].toString());
    newParams.set('maxPrice', priceRange[1].toString());
    
    if (priceOrder) newParams.set('priceOrder', priceOrder);
    if (nameOrder) newParams.set('nameOrder', nameOrder);
    if (createdAt) newParams.set('createdAt', createdAt);
    
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setPriceRange([0, 999999]);
    setPriceOrder('');
    setNameOrder('');
    setCreatedAt('');
    setSearchParams(new URLSearchParams());
  };

  const FilterContent = () => (
    <Box sx={{ 
      width: isMobile ? '97vw' : '15vw', 
      padding: '1vw', 
      textAlign: 'left',
      height: '100%',
      overflowY: 'auto'
    }}>
      <Typography variant="h5" sx={{ marginBottom: '1vw', fontWeight: 'bold' }}>Filters</Typography>
      <Box sx={{ marginBottom: '2vw', display: 'flex', flexDirection: 'column', gap: '1vw' }}>
        <Typography gutterBottom>Price</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={999999}
          sx={{ width: '90%', color: 'primary.contrastText', marginLeft: isMobile ? '4vw' : '0vw' }}
        />
        <Box sx={{ display: 'flex', gap: '1vw', marginBottom: '1vw', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'space-evenly', width: '100%'}}>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%'}}>
            <Typography>Min</Typography>
            <TextField
              variant='standard'
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              size="small"
              sx={{ 
                width: '60%',
                '& .MuiOutlinedInput-root': {
                  color: 'primary.contrastText',
                  '& fieldset': {
                    borderColor: 'primary.contrastText',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.contrastText',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.contrastText',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'primary.contrastText',
                },
              }}
            />
          </Box>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: '0.5vw', width: '100%'}}>
            <Typography>Max</Typography>
            <TextField
              variant='standard'
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              size="small"
              sx={{ 
                width: '60%',
                '& .MuiOutlinedInput-root': {
                  color: 'primary.contrastText',
                  '& fieldset': {
                    borderColor: 'primary.contrastText',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.contrastText',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.contrastText',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'primary.contrastText',
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Typography sx={{paddingBottom: '1vw'}}>Price Order</Typography>
      <FormControl fullWidth sx={{ marginBottom: '2vw' }}>
        <Select
          value={priceOrder}
          onChange={handlePriceOrderChange}
          sx={{
            color: 'primary.contrastText',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
          }}
        >
          <MenuItem value="price_asc">Low to High</MenuItem>
          <MenuItem value="price_desc">High to Low</MenuItem>
        </Select>
      </FormControl>

      <Typography sx={{paddingBottom: '1vw'}}>Name Order</Typography>
      <FormControl fullWidth sx={{ marginBottom: '2vw' }}>
        <Select
          value={nameOrder}
          onChange={handleNameOrderChange}
          sx={{
            color: 'primary.contrastText',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
          }}
        >
          <MenuItem value="name_asc">A-Z</MenuItem>
          <MenuItem value="name_desc">Z-A</MenuItem>
        </Select>
      </FormControl>

      <Typography sx={{paddingBottom: '1vw'}}>Created at</Typography>
      <FormControl fullWidth sx={{ marginBottom: '2vw' }}>
        <Select
          value={createdAt}
          onChange={handleCreatedAtChange}
          sx={{
            color: 'primary.contrastText',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.contrastText',
            },
          }}
        >
          <MenuItem value="newest">Newest</MenuItem>
          <MenuItem value="oldest">Oldest</MenuItem>
        </Select>   
      </FormControl>

      <Box sx={{ display: 'flex', gap: '1vw', marginTop: '2vw', justifyContent: 'space-between' }}>
        <Button 
          variant="contained" 
          onClick={applyFilters}
          sx={{ 
            bgcolor: 'primary.contrastText', 
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.contrastText',
              opacity: 0.9
            }
          }}
        >
          Apply
        </Button>
        <Button 
          variant="outlined" 
          onClick={clearFilters}
          sx={{ 
            borderColor: 'primary.contrastText',
            color: 'primary.contrastText',
            '&:hover': {
              borderColor: 'primary.contrastText',
              opacity: 0.9
            }
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton 
          onClick={() => setDrawerOpen(true)}
          sx={{ 
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            bgcolor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.contrastText',
              opacity: 0.9
            },
          }}
        >
          <FilterListIcon sx={{ fontSize: '10vw' }}/>
        </IconButton>
        <SwipeableDrawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpen={() => setDrawerOpen(true)}
          sx={{
            '& .MuiDrawer-paper': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
            },
          }}
        >
          <FilterContent />
        </SwipeableDrawer>
      </>
    );
  }

  return <FilterContent />;
};

export default FilterAndOrderProductGrid;