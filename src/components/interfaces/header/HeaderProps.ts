import { IProduct } from "../products/IProducts";
import SxProps from "../SxProps";

export default interface HeaderProps extends SxProps {
    products: IProduct[]
}