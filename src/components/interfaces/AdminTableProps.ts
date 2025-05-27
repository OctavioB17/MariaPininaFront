import { GridPaginationModel, GridColDef, GridRowParams } from "@mui/x-data-grid";

export interface AdminTableProps {
    columns: GridColDef[];
    rows: Record<string, unknown>[];
    title: string;
    loading?: boolean;
    getRowId?: (row: Record<string, unknown>) => string | number;
    onRowClick?: (params: GridRowParams) => void;
    paginationModel?: GridPaginationModel;
    onPaginationModelChange?: (model: GridPaginationModel) => void;
    rowCount?: number;
    processRowUpdate?: (newRow: Record<string, unknown>, oldRow: Record<string, unknown>) => Promise<Record<string, unknown>>;
  } 