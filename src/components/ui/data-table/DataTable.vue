<script setup lang="ts" generic="TData, TValue">
import type {
    ExpandedState,
    SortingState,
    VisibilityState,
    PaginationState,
    Updater,
    RowSelectionState,
} from '@tanstack/vue-table'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import DataTableToolbar from './DataTableToolbar.vue'
import DataTablePagination from './DataTablePagination.vue'
import { Checkbox } from '@/components/ui/checkbox'
import {
    FlexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from '@tanstack/vue-table'
import { computed, onBeforeMount, ref, toRaw } from 'vue'
import { valueUpdater } from '@/lib/utils'
import {
    type DataTableEmits,
    type DataTableProps,
    PAGE_INDEX_DEFAULT,
    PAGE_SIZE_DEFAULT,
    type ParamsDataTableDataSource,
    PER_PAGE_OPTIONS,
} from '.'
import DataTableColumnHeader from './DataTableColumnHeader.vue'

const props = withDefaults(defineProps<DataTableProps<TData, TValue>>(), {
    enableServerSide: false,
    enableMultiSort: false,
    enableSelection: false,
    enableSorting: false,
    rowCount: 0,
    perPageOptions: () => PER_PAGE_OPTIONS,
})

const emits = defineEmits<DataTableEmits<TData>>()

const sorting = ref<SortingState>([])
const globalFilter = ref<string>('')
const pagination = ref<PaginationState>({
    pageIndex: PAGE_INDEX_DEFAULT,
    pageSize: PAGE_SIZE_DEFAULT,
})
const rowSelection = ref<RowSelectionState>({})
// const columnVisibility = ref<VisibilityState>({})
// const expanded = ref<ExpandedState>({})

const rowCount = computed(() => props.rowCount)
const currentParams = computed<ParamsDataTableDataSource>(() => ({
    globalFilter: globalFilter.value,
    pagination: pagination.value,
    rowsSelected: tableRowSelection.value,
    sorting: tableSortedRows.value,
}))

const onGlobalFilterChange = (updaterOrValue: Updater<string>) => {
    valueUpdater(updaterOrValue, globalFilter)
    if (props.enableServerSide) {
        pagination.value.pageIndex = PAGE_INDEX_DEFAULT
        pagination.value.pageSize = PAGE_SIZE_DEFAULT
    }
    emits('get:globalFilter', currentParams.value)
}
const onPaginationChange = (updaterOrValue: Updater<PaginationState>) => {
    valueUpdater(updaterOrValue, pagination)
    emits('get:pagination', currentParams.value)
}
const onSortingChange = (updaterOrValue: Updater<SortingState>) => {
    valueUpdater(updaterOrValue, sorting)
    emits('get:sorting', currentParams.value)
}
const onRowSelectionChange = (updaterOrValue: Updater<RowSelectionState>) => {
    valueUpdater(updaterOrValue, rowSelection)
    emits('get:rowSelection', currentParams.value)
}
// const onColumnVisibilityChange = (updaterOrValue: Updater<VisibilityState>) => valueUpdater(updaterOrValue, columnVisibility)
// const onExpandedChange = (updaterOrValue: Updater<ExpandedState>) => valueUpdater(updaterOrValue, expanded)

const table = useVueTable({
    get data() {
        return props.data
    },
    get columns() {
        return props.columns
    },
    getCoreRowModel: getCoreRowModel(),
    enableMultiSort: props.enableMultiSort,
    enableRowSelection: props.enableRowSelection,
    enableSorting: props.enableSorting,
    ...(props.getRowId ? { getRowId: props.getRowId } : {}),
    state: {
        get sorting() {
            return sorting.value
        },
        // get columnVisibility() { return columnVisibility.value },
        // get expanded() { return expanded.value },
        get rowSelection() {
            return rowSelection.value
        },
        get globalFilter() {
            return globalFilter.value
        },
        get pagination() {
            return pagination.value
        },
    },
    ...{
        ...(props.enableServerSide
            ? {
                  manualSorting: true,
                  sortDescFirst: true,
                  manualPagination: true,
                  manualFiltering: true,
                  autoResetPageIndex: false,
                  rowCount: rowCount.value,
              }
            : {
                  autoResetPageIndex: true,
                  getPaginationRowModel: getPaginationRowModel(),
                  getSortedRowModel: getSortedRowModel(),
                  getFilteredRowModel: getFilteredRowModel(),
                  getExpandedRowModel: getExpandedRowModel(),
              }),
    },
    onSortingChange: onSortingChange,
    // onColumnVisibilityChange: onColumnVisibilityChange,
    onRowSelectionChange: onRowSelectionChange,
    // onExpandedChange: onExpandedChange,
    onGlobalFilterChange: onGlobalFilterChange,
    onPaginationChange: onPaginationChange,
})

const tableSortedRows = computed(() => table.getState().sorting.map((sort) => toRaw(sort)))

const tableRowSelection = computed(() => {
    // if (props.enableServerSide) {
    //     return rowSelection.value
    // }
    // return table.getSelectedRowModel().rows.reduce((acc, row) => {
    //     acc[row.id] = true
    //     return acc
    // }, {} as RowSelectionState)
    return table.getState().rowSelection
})

const tableCellColspan = computed(() => {
    let length = table.getAllColumns().length
    if (props.enableRowSelection) {
        length += 1
    }
    return length
})

function syncStateFromURL() {
    const params = new URLSearchParams(window.location.search)
    globalFilter.value = params.get('search') || ''
    pagination.value.pageIndex = parseInt(params.get('page') || '1', 10) - 1
    pagination.value.pageSize = parseInt(params.get('per_page') || '10', 10)
    const sortField = params.get('sort_field')
    const sortDirection = params.get('sort_direction')

    if (sortField && sortDirection) {
        sorting.value = [
            {
                id: sortField,
                desc: sortDirection === 'desc',
            },
        ]
    } else {
        sorting.value = []
    }
}
if (props.enablePersistState) {
    onBeforeMount(() => {
        syncStateFromURL()
    })
}
</script>
<template>
    <div>
        <DataTableToolbar :table="table" :debounce-global-filter="debounceGlobalFilter">
            <template #left>
                <slot name="toolbar-left" />
            </template>
            <template #right>
                <slot name="toolbar-right" />
            </template>
        </DataTableToolbar>
        <div class="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-if="props.enableRowSelection">
                            <Checkbox
                                aria-label="Select All"
                                :model-value="
                                    table.getIsAllPageRowsSelected() ||
                                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                                "
                                @update:model-value="
                                    (value) => table.toggleAllPageRowsSelected(!!value)
                                "
                            />
                        </TableHead>
                        <TableHead
                            v-for="header in headerGroup.headers"
                            :key="header.id"
                            :dense-padding="true"
                        >
                            <DataTableColumnHeader :header="header" />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <TableRow
                            v-for="row in table.getRowModel().rows"
                            :key="row.id"
                            :data-state="row.getIsSelected() ? 'selected' : undefined"
                        >
                            <TableCell v-if="props.enableRowSelection">
                                <Checkbox
                                    :model-value="row.getIsSelected()"
                                    @update:model-value="(value) => row.toggleSelected(!!value)"
                                    aria-label="Select row"
                                />
                            </TableCell>
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <FlexRender
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()"
                                />
                            </TableCell>
                        </TableRow>
                    </template>
                    <template v-else>
                        <TableRow>
                            <TableCell :colspan="tableCellColspan" class="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>
        <DataTablePagination
            :table="table"
            :per-pages-options="perPageOptions"
            :row-selected="rowSelection"
            :row-count="props.rowCount"
            :enable-server-side="props.enableServerSide"
            class="mt-4"
        />
    </div>
</template>
