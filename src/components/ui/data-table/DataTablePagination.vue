<script setup lang="ts" generic="TData">
import { type RowSelectionState, type Table } from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import {
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from '@/components/ui/pagination'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import { computed, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { type AcceptableValue } from 'reka-ui'
import { type DataTablePerPageOptions } from '.'

interface DataTablePagination {
    table: Table<TData>
    class?: HTMLAttributes['class']
    rowCount?: number
    rowSelected?: RowSelectionState
    enableServerSide?: boolean
    perPagesOptions: DataTablePerPageOptions[]
}

const props = defineProps<DataTablePagination>()

const onChangePage = (value: number) => {
    props.table.setPageIndex(value - 1)
}

const onChangePerPage = (value: AcceptableValue) => {
    props.table.setPageIndex(0)
    props.table.setPageSize(Number(value))
}

const rowCount = computed(() => {
    if (props.enableServerSide) {
        return props.rowCount
    }
    return props.table.getFilteredRowModel().rows.length
})

const tableRowSelection = computed(() => {
    if (props.enableServerSide) {
        return props.rowSelected ? Object.keys(props.rowSelected).length : 0
    }
    return props.table.getSelectedRowModel().rows.length
})
</script>

<template>
    <div :class="cn('flex items-center justify-between', props.class)">
        <div>
            <p class="text-sm text-muted-foreground">
                {{ tableRowSelection }} of {{ rowCount }} row(s) selected.
            </p>
        </div>

        <div class="flex items-center gap-4">
            <Pagination
                v-slot="{ page }"
                :page="props.table.getState().pagination.pageIndex + 1"
                @update:page="onChangePage"
                :items-per-page="props.table.getState().pagination.pageSize"
                :total="rowCount"
                :sibling-count="1"
                show-edges
                :page-count="10"
                :default-page="props.table.getState().pagination.pageIndex + 1"
            >
                <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                    <PaginationFirst />
                    <PaginationPrev />

                    <template v-for="(item, index) in items">
                        <PaginationListItem
                            v-if="item.type === 'page'"
                            :key="index"
                            :value="item.value"
                            as-child
                        >
                            <Button
                                class="w-8 h-8 p-0"
                                :variant="item.value === page ? 'filled' : 'outline'"
                            >
                                {{ item.value }}
                            </Button>
                        </PaginationListItem>
                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                    </template>

                    <PaginationNext />
                    <PaginationLast />
                </PaginationList>
            </Pagination>
            <div class="w-20">
                <Select
                    :model-value="props.table.getState().pagination.pageSize"
                    @update:model-value="onChangePerPage"
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Per page" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            v-for="item in props.perPagesOptions"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ item.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </div>
</template>
