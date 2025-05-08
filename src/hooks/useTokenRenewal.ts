import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { variables } from '../config/variables';

const useTokenRenewal = (isLogged: boolean) => {
  useEffect(() => {
    if (!isLogged) {
      console.log('Usuario no está logueado, no se intentará renovar el token.');
      return;
    }

    const renewToken = async () => {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) {
        console.log('No se encontró refreshToken, no se puede renovar el token.');
        return;
      }

      console.log('Intentando renovar el token con refreshToken:', refreshToken);

      try {
        const response = await axios.post(`${variables.backendIp}/login/renew-token`, { refreshToken });
        const { accessToken } = response.data;
        console.log('Nuevo accessToken recibido:', accessToken);

        const expiresInAccessToken = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutos
        Cookies.set('token', accessToken, { expires: expiresInAccessToken });
        console.log('accessToken actualizado en las cookies.');
      } catch (error) {
        console.error('Error al renovar el token:', error);
      }
    };

    console.log('Configurando intervalo para renovar el token cada 18 segundos.');
    const interval = setInterval(() => {
      renewToken();
    }, 5 * 60 * 1000);

    return () => {
      console.log('Limpiando el intervalo de renovación del token.');
      clearInterval(interval);
    };
  }, [isLogged]);
};

export default useTokenRenewal;