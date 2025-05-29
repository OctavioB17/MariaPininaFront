import { Box, Link, Typography, useMediaQuery } from '@mui/material'
import React, { JSX } from 'react'
import { FaGithub } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { theme } from '../../config/ThemeConfig';

const Footer: React.FC = (): JSX.Element => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      bgcolor: 'primary.main', 
      padding: isMobile ? '8vw 5vw' : '2vw', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: isMobile ? '4vw' : '1vw', 
      justifyContent: 'center', 
      alignItems: 'center' 
    }}>
        <Box sx={{
          display: 'flex', 
          justifyContent: 'space-evenly', 
          width: isMobile ? '90vw' : '25vw',
          gap: isMobile ? '8vw' : '0'
        }}>
            <Link href='https://github.com/OctavioB17' target='_blank'>
                <FaGithub style={{fontSize: isMobile ? '6vw' : '1.5vw'}} fill='#0d3e45'/>
            </Link>
            <Link href='https://www.linkedin.com/in/octavio-bruza-2b9290292/' target='_blank'>
                <FaLinkedin style={{fontSize: isMobile ? '6vw' : '1.5vw'}} fill='#0d3e45'/>
            </Link>
            <Link href='mailto:octaviobruza17@gmail.com' >
                <SiGmail style={{fontSize: isMobile ? '6vw' : '1.5vw'}} fill='#0d3e45'/>
            </Link>
            <Link href='https://wa.me/5493426264721' target='_blank'>
                <FaWhatsapp style={{fontSize: isMobile ? '6vw' : '1.5vw'}} fill='#0d3e45'/>
            </Link>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row', 
          gap: isMobile ? '2vw' : '1vw',
          textAlign: 'center'
        }}>
            <Typography sx={{ 
              textAlign: 'center',
              fontSize: isMobile ? '3.5vw' : 'inherit'
            }}>
                Maria Pinina by Octavio Bruza. Powered by myself
            </Typography>
        </Box>
    </Box>
  )
}

export default Footer