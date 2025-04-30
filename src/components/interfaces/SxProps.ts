import { SxProps } from "@mui/material";
import ChildrenProp from "./ChildrenProp";

export interface ISxProps {
    sx?: SxProps
}

export interface SxPropWithChildren extends ISxProps, ChildrenProp {}