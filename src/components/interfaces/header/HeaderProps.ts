import ICategory from "../../../interfaces/ICategories";
import { IProduct } from "../../../interfaces/IProducts";
import { ISxProps } from "../SxProps";

export default interface HeaderProps extends ISxProps {
    products: IProduct[]
    categories: ICategory[]
}