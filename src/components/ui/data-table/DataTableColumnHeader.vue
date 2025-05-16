<script setup lang="ts" generic="TData, TValue">
import { FlexRender, type Header } from '@tanstack/vue-table'
import { ArrowUpNarrowWide, ArrowDownNarrowWide, ArrowUpDown } from 'lucide-vue-next'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableColumnHeaderProps {
    header: Header<TData, TValue>
}

defineProps<DataTableColumnHeaderProps>()
</script>

<script lang="ts">
export default {
    inheritAttrs: false,
}
</script>

<template>
    <DropdownMenu v-if="header.column.getCanSort()">
        <DropdownMenuTrigger
            :class="[
                'w-full flex h-full items-center px-4 data-[state=open]:bg-accent hover:bg-accent justify-between',
            ]"
            as-child
        >
            <button>
                <FlexRender
                    v-if="!header.isPlaceholder"
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                />
                <ArrowDownNarrowWide
                    v-if="header.column.getIsSorted() === 'desc'"
                    class="w-4 h-4"
                />
                <ArrowUpNarrowWide
                    v-else-if="header.column.getIsSorted() === 'asc'"
                    class="w-4 h-4"
                />
                <ArrowUpDown v-else class="w-4 h-4" />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
            <DropdownMenuItem
                @click="header.column.toggleSorting(false, header.column.getCanMultiSort())"
            >
                <ArrowUpNarrowWide class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Asc
            </DropdownMenuItem>
            <DropdownMenuItem
                @click="header.column.toggleSorting(true, header.column.getCanMultiSort())"
            >
                <ArrowDownNarrowWide class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                Desc
            </DropdownMenuItem>
            <template v-if="header.column.getIsSorted()">
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="header.column.clearSorting()">
                    <ArrowUpDown class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                    Clear Sorting
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
    <template v-else>
        <div class="px-4 w-full h-full flex items-center">
            <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
            />
        </div>
    </template>
</template>
