import { ISxProps } from "./SxProps";

export interface AdminMenuListProps extends ISxProps {
    open?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
}