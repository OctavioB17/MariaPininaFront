import React, { JSX } from 'react'
import NormalBoxProps from '../interfaces/reusable/NormalBoxProps'
import { Box } from '@mui/material'

const NormalBox: React.FC<NormalBoxProps> = ({ children, sx }): JSX.Element => {
  return (
    <Box sx={{padding: '2vw', bgcolor: 'primary.main', border: '2px solid #0d3e45', borderRadius: '10px', ...sx}}>
        {children}
    </Box>
  )
}

export default NormalBox