import { Box } from '@mui/material'
import React, { JSX } from 'react'
import NormalBox from '../reusable/NormalBox'
import Header from '../header/Header'

const LandingPage: React.FC = (): JSX.Element => {
  return (
    <Box>
        <NormalBox sx={{width: '90vw', padding: '1vw'}}>
          <Header sx={{borderBottom: '2px solid black'}}/>
          <Box sx={{padding: '10vw'}}>
            hola
          </Box>
        </NormalBox>
    </Box>  
  )
}

export default LandingPage