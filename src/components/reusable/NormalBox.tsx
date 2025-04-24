import React, { JSX } from 'react'
import INormalBox from '../interfaces/reusable/INormalBox'
import { Box } from '@mui/material'

const NormalBox: React.FC<INormalBox> = ({ children, sx }): JSX.Element => {
  return (
    <Box sx={{padding: '2vw', bgcolor: 'primary.main', border: '2px solid black', borderRadius: '10px', ...sx}}>
        {children}
    </Box>
  )
}

export default NormalBox