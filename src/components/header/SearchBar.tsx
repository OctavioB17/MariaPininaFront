import { Autocomplete, Box, TextField } from '@mui/material'
import React, { JSX, SyntheticEvent } from 'react'
import SearchBarProps from '../interfaces/header/SearchBarProps'
import { useNavigate } from 'react-router-dom'

const SearchBar: React.FC<SearchBarProps> = ({ products }): JSX.Element => {
  const navigate = useNavigate()
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
    <Box>
      <Autocomplete
        freeSolo
        disablePortal
        options={productNameOnly}
        onChange={handleProductSelect}
        onKeyDown={handleKeyPress}
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