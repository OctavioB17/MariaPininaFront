import NBoxWithHeaderAndFooter from '../reusable/NBoxWithHeaderAndFooter'
import { Box, CircularProgress, Typography } from '@mui/material'
import NormalBox from '../reusable/NormalBox'
import { useNavigate, useParams } from 'react-router-dom'
import { JSX, useEffect, useState } from 'react'
import axios from 'axios'
import { variables } from '../../config/variables'


const UserAccountAuthorization: React.FC = (): JSX.Element => {

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
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3vw', paddingBottom: '3vw'}}>
            <NormalBox sx={{display: 'flex', width: '70vw', height: '80vh', justifyContent: 'space-evenly', padding: 0}}>
              {
                imageLoad && authSuccess ?
                    <>
                    <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '5vw', width: '25vw', gap: '2vw'}}>
                        <Typography variant='h3'>
                            {authMessage}
                        </Typography>
                        <Typography variant='h4'>
                            Redirecting to login page in {count}...
                        </Typography>
                    </Box>
                    <Box onLoad={() => setImageLoad(true) } component='img' src='../src/assets/pinina.webp' sx={{width: '33.5vw'}}/>
                    </>
                :
                  <Box sx={{ width: '33.5vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress sx={{color: 'primary.contrastText'}}/>
                    <Box
                      component='img'
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