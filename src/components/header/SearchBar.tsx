import { Autocomplete, Box, TextField, useMediaQuery, useTheme } from '@mui/material'
import React, { JSX, SyntheticEvent } from 'react'
import SearchBarProps from '../interfaces/header/SearchBarProps'
import { useNavigate } from 'react-router-dom'

const SearchBar: React.FC<SearchBarProps> = ({ products }): JSX.Element => {
  const navigate = useNavigate()
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const productNameOnly = products.map(product => product.name)

  const handleProductSelect = (_event: SyntheticEvent, selectedProduct: string | null) => {
    if (selectedProduct) {
      const product = products.find(p => p.name === selectedProduct)
      if (product) {
        navigate(`/products/search/${product.name}`)
      }
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      const input = event.target as HTMLInputElement
      if (input.value) {
        navigate(`/products/search/${input.value}`)
      }
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Autocomplete
        freeSolo
        disablePortal
        options={productNameOnly}
        onChange={handleProductSelect}
        onKeyDown={handleKeyPress}
        sx={{ 
          width: isMobile ? '100%' : '50vw',
          '& .MuiInputBase-root': {
            height: isMobile ? '40px' : 'auto',
            fontSize: isMobile ? '14px' : '16px'
          }
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: isMobile ? '14px' : '16px'
            },
          },
          listbox: {
            sx: {
              maxHeight: isMobile ? '200px' : '300px'
            }
          }
        }}
        renderInput={(params) => (
          <TextField
            color='secondary'
            focused
            {...params}
            sx={{
              fontFamily: (theme) => theme.typography.subtitle1.fontFamily,
              borderRadius: '10px',
              '& .MuiOutlinedInput-root': {
                padding: isMobile ? '0 8px' : '0 14px'
              },
              '& .MuiInputBase-input': {
                padding: isMobile ? '8px 4px' : '14px 8px'
              }
            }}
            placeholder={isMobile ? 'Search...' : 'Search anything you want'}
          />
        )}
      />
    </Box>
  )
}

export default SearchBar