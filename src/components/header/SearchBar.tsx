import { Autocomplete, Box, TextField } from '@mui/material'
import React, { JSX } from 'react'
import SearchBarProps from '../interfaces/header/SearchBarProps'
import { useNavigate } from 'react-router-dom'

const SearchBar: React.FC<SearchBarProps> = ({ products }): JSX.Element => {

  const navigate = useNavigate()
  const productNameOnly = products.map(product => product.name)

  const handleProductSelect = (event: any, selectedProduct: string | null) => {
    if (selectedProduct) {
      const product = products.find(p => p.name === selectedProduct)
      if (product) {
        navigate(`/products/${product.name}`)
      }
    }
  }

  return (
    <Box>
      <Autocomplete
        disablePortal
        options={productNameOnly}
        onChange={handleProductSelect}
        sx={{ width: '50vw' }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',       
            },
          },
        }}
        renderInput={(params) => (
          <TextField
            color='secondary'
            focused
            {...params}
            sx={{
              fontFamily: (theme) => theme.typography.subtitle1.fontFamily,
              borderRadius: '10px',
            }}
            placeholder='Search anything you want'
          />
        )}
      />
    </Box>
  )
}

export default SearchBar