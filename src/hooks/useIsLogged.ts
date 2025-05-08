import { selectUser } from "../store/userSlice"
import { useAppSelector } from "./useAppSelector"
import Cookies from "js-cookie"

const useIsLogged = (): boolean => {
    const user = useAppSelector(selectUser)
    const token = Cookies.get('token')
    const name = sessionStorage.getItem('name')
    const surname = sessionStorage.getItem('surname')
    const isLogged = user && token && name && surname
    return Boolean(isLogged)
} 

export default useIsLogged