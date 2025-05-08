import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { variables } from '../config/variables';

const useTokenRenewal = (isLogged: boolean) => {
  useEffect(() => {
    if (!isLogged) return;

    const renewToken = async () => {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) return;

      try {
        const response = await axios.post(`${variables.backendIp}/token/renew`, { refreshToken });
        const { accessToken } = response.data;
        const expiresInAccessToken = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutos
        Cookies.set('token', accessToken, { expires: expiresInAccessToken });
      } catch (error) {
        console.error('Error al renovar el token:', error);
      }
    };

    const interval = setInterval(() => {
      renewToken();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isLogged]);
};

export default useTokenRenewal;