import NBoxWithHeaderAndFooter from '../../reusable/NBoxWithHeaderAndFooter'
import { Box, CircularProgress, Typography, useMediaQuery } from '@mui/material'
import NormalBox from '../../reusable/NormalBox'
import { useNavigate, useParams } from 'react-router-dom'
import { JSX, useEffect, useState } from 'react'
import axios from 'axios'
import { variables } from '../../../config/variables'
import { theme } from '../../../config/ThemeConfig'

const UserAccountAuthorization: React.FC = (): JSX.Element => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate()
  const { id } = useParams()
  const [imageLoad, setImageLoad] = useState<boolean>(false)
  const [authSuccess, setAuthSuccess] = useState<boolean>(false)
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const [count, setCount] = useState<number>(7)

  useEffect(() => {
    const auth = async (userId: string): Promise<void> => {
        try {
            const apiResponse = await axios.get(`${variables.backendIp}/users/authorize-user/${userId}`)
            if (!apiResponse.data) {
                setAuthMessage('Error to authorize user. Contact to mpininaapp@gmail.com')
                setAuthSuccess(true)
            }
            setAuthMessage('User authorization success.')
            setAuthSuccess(true)
        } catch {
            setAuthMessage('Error to authorize user. Contact to mpininaapp@gmail.com')
            setAuthSuccess(true)
        }
    }

    if (id) {
        auth(id)
    }
  })

  useEffect(() => {
    if (authSuccess) {
        const interval = setInterval(() => {
            setCount(prevCount => prevCount - 1);
        }, 1000);

        return () => clearInterval(interval);
    }
  }, [authSuccess]);

  useEffect(() => {
    if (count === 0) {
        navigate('/login')
    }
  }, [count, navigate])

  return (
    <NBoxWithHeaderAndFooter>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: isMobile ? '6vw' : '3vw', paddingBottom: isMobile ? '6vw' : '3vw'}}>
            <NormalBox sx={{
                display: 'flex', 
                width: isMobile ? '90vw' : '70vw', 
                height: isMobile ? 'auto' : '80vh', 
                justifyContent: 'space-evenly', 
                padding: 0,
                flexDirection: isMobile ? 'column' : 'row',
                border: isMobile ? 'none' : '2px solid #0d3e45'
            }}>
              {
                imageLoad && authSuccess ?
                    <>
                    <Box sx={{
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        paddingLeft: isMobile ? '5vw' : '5vw', 
                        width: isMobile ? '80vw' : '25vw', 
                        gap: isMobile ? '4vw' : '2vw',
                        paddingTop: isMobile ? '4vw' : 0,
                        paddingBottom: isMobile ? '4vw' : 0
                    }}>
                        <Typography sx={{fontSize: isMobile ? '6vw' : 'inherit'}} variant='h3'>
                            {authMessage}
                        </Typography>
                        <Typography sx={{fontSize: isMobile ? '4vw' : 'inherit'}} variant='h4'>
                            Redirecting to login page in {count}...
                        </Typography>
                    </Box>
                    <Box 
                        onLoad={() => setImageLoad(true)} 
                        component='img' 
                        alt='pinina' 
                        src='../src/assets/pinina.webp' 
                        sx={{
                            width: isMobile ? '90vw' : '33.5vw',
                            display: isMobile ? 'none' : 'block',
                            marginTop: isMobile ? '4vw' : 0,
                            marginBottom: isMobile ? '4vw' : 0
                        }}
                    />
                    </>
                :
                  <Box sx={{ width: isMobile ? '90vw' : '33.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress sx={{color: 'primary.contrastText'}}/>
                    <Box
                      component='img'
                      alt='pinina'
                      src='../src/assets/pinina.webp'
                      onLoad={() => setImageLoad(true)}
                      sx={{
                        width: '100%',
                        display: 'none',
                      }}
                    />
                  </Box>
              }
            </NormalBox>
        </Box>
    </NBoxWithHeaderAndFooter>
  )
}

export default UserAccountAuthorization