import { Box, Link, Typography, useMediaQuery } from '@mui/material'
import React, { JSX } from 'react'
import { FaGithub } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";



const Footer: React.FC = (): JSX.Element => {

  const isSmallScreen = useMediaQuery('(max-width:1200px)');

  return (
    <Box sx={{ bgcolor: 'primary.main', padding: isSmallScreen ? '5vw' : '2vw', display: 'flex', flexDirection: 'column', gap: '1vw', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{display: 'flex', justifyContent: 'space-evenly', width: isSmallScreen ? '90vw' : '25vw' }}>
            <Link href='https://github.com/OctavioB17' target='_blank'>
                <FaGithub style={{fontSize: '1.5vw'}} fill='#213547'/>
            </Link>
            <Link href='https://www.linkedin.com/in/octavio-bruza-2b9290292/' target='_blank'>
                <FaLinkedin style={{fontSize: '1.5vw'}} fill='#213547'/>
            </Link>
            <Link href='mailto:octaviobruza17@gmail.com' >
                <SiGmail style={{fontSize: '1.5vw'}} fill='#213547'/>
            </Link>
            <Link href='https://wa.me/5493426264721' target='_blank'>
                <FaWhatsapp style={{fontSize: '1.5vw'}} fill='#213547'/>
            </Link>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: '1vw'}}>
            <Typography sx={{ textAlign: 'center'}}>
                Maria Pinina by Octavio Bruza. Powered by myself
            </Typography>
        </Box>
    </Box>
  )
}

export default Footer