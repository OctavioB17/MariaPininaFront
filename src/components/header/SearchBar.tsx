import { Autocomplete, Box, TextField } from '@mui/material'
import React, { JSX } from 'react'
import SearchBarProps from '../interfaces/header/SearchBarProps'

const SearchBar: React.FC<SearchBarProps> = ({ products }): JSX.Element => {

  const productNameOnly = products.map(product => product.name)

  return (
    <Box>
      <Autocomplete
        disablePortal
        options={productNameOnly}
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