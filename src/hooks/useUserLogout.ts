import { useDispatch } from "react-redux"
import { clearUser } from "../store/userSlice"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

export const useUserLogout = () => {
    const dispatch = useDispatch()
    const navigate= useNavigate()

    const logout = () => {
        dispatch(clearUser())

        sessionStorage.removeItem('name')
        sessionStorage.removeItem('surname')

        Cookies.remove('token')

        navigate('/')
    }

    return logout
}