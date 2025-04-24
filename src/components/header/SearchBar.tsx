import { Autocomplete, Box, TextField } from '@mui/material'
import React, { JSX } from 'react'
import {top100Films} from './top100films'

const SearchBar: React.FC = (): JSX.Element => {
  return (
    <Box>
        <Autocomplete
        disablePortal
        options={top100Films}
        sx={{ width: '50vw', }}
        renderInput={(params) => <TextField color='secondary' focused {...params} sx={{ fontFamily: (theme) => theme.typography.subtitle1.fontFamily, borderRadius: '10px' }} placeholder='Search anything you want'/>}
        />
    </Box>
  )
}

export default SearchBar