import {
    type ColumnDef,
    type PaginationState,
    type RowSelectionState,
    type SortingState,
} from '@tanstack/vue-table'

export { default as DataTable } from './DataTable.vue'
export { default as DataTableColumnHeader } from './DataTableColumnHeader.vue'
export { default as DataTableToolbar } from './DataTableToolbar.vue'
export { default as DataTablePagination } from './DataTablePagination.vue'

export type DataTablePerPageOptions = {
    label: string
    value: number
}

export const PAGE_SIZE_DEFAULT = 10
export const PAGE_INDEX_DEFAULT = 0
export const PER_PAGE_OPTIONS: DataTablePerPageOptions[] = [
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
]

export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    rowCount?: number
    perPageOptions?: DataTablePerPageOptions[]
    enableServerSide?: boolean
    enableMultiSort?: boolean
    enableRowSelection?: boolean
    enableSorting?: boolean
    debounceGlobalFilter?: number
    debouncePagination?: number
    getRowId?: (row: TData) => string
    enablePersistState?: boolean
}

export type ParamsDataTableDataSource = {
    pagination: PaginationState
    sorting: SortingState
    globalFilter: string
    rowsSelected: RowSelectionState
}

export interface DataTableEmits<TData> {
    (e: 'get:rowSelection', params: ParamsDataTableDataSource): void
    (e: 'get:sorting', params: ParamsDataTableDataSource): void
    (e: 'get:pagination', params: ParamsDataTableDataSource): void
    (e: 'get:globalFilter', params: ParamsDataTableDataSource): void
}
