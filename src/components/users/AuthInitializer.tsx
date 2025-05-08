import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios, { AxiosResponse } from 'axios';
import { variables } from '../../config/variables';
import { IUserNoPassword } from '../../interfaces/IUser';
import { selectUser, setUser } from '../../store/userSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector'; // Asegúrate de importar esto

const AuthInitializer: React.FC = (): null => {
    const dispatch = useAppDispatch();
    const token: string | undefined = Cookies.get('token');
    const user = useAppSelector(selectUser);

    useEffect(() => {
        const fetchUser = async () => {
            const userResponse: AxiosResponse<IUserNoPassword> = await axios.get(`${variables.backendIp}/users/find/no-password/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const user = userResponse.data;

            dispatch(setUser(user));
            sessionStorage.setItem('name', user.name);
            sessionStorage.setItem('surname', user.surname);
        };

        if (token && !user) {
            fetchUser();
        }
    }, [token, user, dispatch]);

    return null;
};

export default AuthInitializer;