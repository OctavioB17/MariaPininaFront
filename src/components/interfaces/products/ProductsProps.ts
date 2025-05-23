import { IProduct } from "../../../interfaces/IProducts";
import { SxProps } from "@mui/material";
export default interface ProductsProps {
    product: IProduct
    sx?: SxProps
}