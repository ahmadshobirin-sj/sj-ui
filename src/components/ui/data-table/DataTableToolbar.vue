<script setup lang="ts" generic="TData">
import { Input } from '@/components/ui/input'
import type { Table } from '@tanstack/vue-table'
import { useDebounceFn } from '@vueuse/core'
import { ref } from 'vue'
import { string } from 'yup'

interface DataTableToolbarProps {
    table: Table<TData>
    debounceGlobalFilter?: number
}

const props = defineProps<DataTableToolbarProps>()

const globalFilter = ref<string>(props.table.getState().globalFilter ?? '')

const setGlobalFilterDebounce = props.debounceGlobalFilter
    ? useDebounceFn((value: string) => {
          props.table.setGlobalFilter(value)
      }, props.debounceGlobalFilter)
    : (value: string) => {
          props.table.setGlobalFilter(value)
      }

const onGlobalFilterChange = (value: string | number) => {
    value = String(value).trim()
    globalFilter.value = value
    setGlobalFilterDebounce(value)
}
</script>

<template>
    <div class="flex items-center justify-between py-4 gap-2">
        <div class="flex items-center gap-4 md:gap-2 flex-1">
            <Input
                :model-value="`${globalFilter}`"
                @update:model-value="onGlobalFilterChange"
                autocomplete="off"
                class="w-48"
                placeholder="Search..."
            />
            <slot name="left" />
        </div>
        <div class="flex items-center gap-2">
            <slot name="right" />
        </div>
    </div>
</template>
