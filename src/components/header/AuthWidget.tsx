import { Box, Typography } from '@mui/material'
import React from 'react'
import Face5Icon from '@mui/icons-material/Face5';
import Face6Icon from '@mui/icons-material/Face6';
import { JSX } from '@emotion/react/jsx-runtime';
import { Link } from 'react-router-dom';

const AuthWidget: React.FC = (): JSX.Element => {

    const notLoged: JSX.Element = (
        <Box sx={{display: 'flex', gap: '1vw'}}>
        <Box sx={{display: 'flex', gap: '1vw', alignItems: 'center'}}>
          <Link to={`/login`}>
            <Typography variant='h4'>Log-in</Typography>
            <Face5Icon/>
          </Link>
        </Box>
        <Box sx={{display: 'flex', gap: '1vw', alignItems: 'center'}}>
            <Link to={`/register`}>
                <Typography variant='h4'>Sign-in</Typography>
                <Face6Icon/>
            </Link>
        </Box>
      </Box>    
    )



  return (
    <div>AuthWidget</div>
  )
}

export default AuthWidget