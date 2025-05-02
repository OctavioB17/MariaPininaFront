import { Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import Face5Icon from '@mui/icons-material/Face5';
import Face6Icon from '@mui/icons-material/Face6';
import { JSX } from '@emotion/react/jsx-runtime';
import { Link } from 'react-router-dom';

const AuthWidget: React.FC = (): JSX.Element => {

    const [logged, setLogged] = useState<boolean>(false)

    const NotLogged = () => { 
        return (
            <Box sx={{display: 'flex', gap: '1vw', color: 'primary.contrastText'}}>
                <Link to={`/login`} style={{display: 'flex', gap: '1vw', alignItems: 'center', color: '#213547'}}>
                    <Typography variant='h4'>Log-in</Typography>
                    <Face5Icon/>
                </Link>
                <Link to={`/register`} style={{display: 'flex', gap: '1vw', alignItems: 'center', color: '#213547'}}>
                    <Typography variant='h4'>Sign-in</Typography>
                    <Face6Icon/>
                </Link>
            </Box>    
        )
    }



  return (
    <Box>
        {
            logged ?
            <div></div>
            :
            <NotLogged/>
        }
    </Box>
  )
}

export default AuthWidget