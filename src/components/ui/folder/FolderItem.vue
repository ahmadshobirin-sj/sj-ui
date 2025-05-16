<script setup lang="ts">
import { type FolderItemProps, type FolderItemType } from '.'
import { computed, inject, provide, ref } from 'vue'
import { cn } from '@/lib/utils'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/composables/useInitials'
import { formatDate, useFolderContext } from './composable/useFolder'
import { Download, FilePen, FilePlus, FolderPen, FolderPlus, Info, Trash2 } from 'lucide-vue-next'

const props = withDefaults(defineProps<FolderItemProps>(), {
    viewType: 'List',
    name: 'Unnamed Folder',
})

const {
    onClickEdit,
    onClickNewFile,
    onClickNewFolder,
    onClickDelete,
    onClickDownload,
    onToggleSelect,
    onClickInfo,
    rowsSelected,
} = useFolderContext()

const isChecked = ref(false)

const parentDepth = inject<number>('depth', 0)
const depth = ref(parentDepth + 1)
provide('depth', depth.value)

const parentKeys = inject<string[]>('parentKeys', [])
if (props.type === 'folder') {
    parentKeys.push(props.keyValue)
}
provide('parentKeys', parentKeys)

const isOpen = ref<boolean>(props.isOpen || false)

const toggleOpen = () => {
    isOpen.value = !isOpen.value
}

const onClick = (type: FolderItemType) => {
    if (props.isDisabled) return
    if (type === 'folder') toggleOpen()
}

const _onClickEdit = () => {
    onClickEdit?.(props)
}

const _onClickNewFile = () => {
    onClickNewFile?.('file', props)
}

const _onClickNewFolder = () => {
    onClickNewFolder?.('folder', props)
}

const _onClickDelete = () => {
    onClickDelete?.(props)
}

const _onClickDownload = () => {
    onClickDownload?.(props)
}

const toggleCheckbox = () => {
    onToggleSelect?.(props.keyValue, props.parentKey, parentKeys)
}

const _onClickInfo = () => {
    onClickInfo?.(props)
}

const _isChecked = computed({
    get: () => rowsSelected?.value.includes(props.keyValue) ?? false,
    set: (value) => {
        isChecked.value = value
    },
})
</script>

<template>
    <div>
        <ContextMenu>
            <ContextMenuTrigger
                class="group/parent flex items-center gap-2 w-full"
                :disabled="props.isDisabled"
                as-child
            >
                <div>
                    <Checkbox
                        :model-value="_isChecked"
                        @update:model-value="toggleCheckbox"
                        :disabled="props.isDisabled"
                    />
                    <div
                        :class="
                            cn(
                                'flex flex-1 items-center gap-2 cursor-pointer transition-all px-2 py-2 rounded-md select-none relative',
                                isOpen && type === 'folder' ? 'bg-primary/5' : '',
                                isDisabled
                                    ? 'opacity-35 cursor-not-allowed'
                                    : 'hover:bg-primary/10',
                            )
                        "
                        @click="onClick(type)"
                    >
                        <!-- <div v-if="depth > 1" class="absolute -left-4 top-1/2 -translate-y-1/2 h-[0.2px] bg-border w-4">
                        </div> -->
                        <div v-if="type === 'folder'" class="self-start">
                            <svg
                                v-if="!isOpen"
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                class="text-primary"
                            >
                                <path
                                    fill="currentColor"
                                    d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h8q.825 0 1.413.588T22 8v10q0 .825-.587 1.413T20 20z"
                                />
                            </svg>
                            <svg
                                v-else
                                xmlns="http://www.w3.org/2000/svg"
                                width="36"
                                height="36"
                                viewBox="0 0 24 24"
                                class="text-primary"
                            >
                                <path
                                    fill="currentColor"
                                    d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h9q.425 0 .713.288T22 7t-.288.713T21 8H7.85q-1.55 0-2.7.975T4 11.45V18l1.975-6.575q.2-.65.738-1.037T7.9 10h12.9q1.025 0 1.613.813t.312 1.762l-1.8 6q-.2.65-.737 1.038T19 20z"
                                />
                            </svg>
                        </div>
                        <div v-else class="self-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                class="text-primary"
                            >
                                <path
                                    fill="currentColor"
                                    d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.83-4.83c-.37-.38-.88-.59-1.41-.59zm7 6V3.5L18.5 9H14c-.55 0-1-.45-1-1"
                                />
                            </svg>
                        </div>
                        <div class="flex-1 relative">
                            <p class="font-medium text-sm text-primary">{{ props.name }}</p>
                            <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                <p v-if="props.type === 'file'">
                                    Type: {{ props.mimeType || 'File' }}
                                </p>
                                <p v-if="props.type === 'file'">
                                    Size:
                                    <Badge severity="warning" class="uppercase">{{
                                        props.size || '-'
                                    }}</Badge>
                                </p>
                                <p v-if="props.date">Date: {{ formatDate(props.date) }}</p>
                                <p v-if="props.owner">
                                    Owner:
                                    <HoverCard>
                                        <HoverCardTrigger>
                                            <Badge severity="success">{{
                                                props.owner.name || '-'
                                            }}</Badge>
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <div class="flex space-x-4">
                                                <Avatar>
                                                    <AvatarFallback class="font-semibold">
                                                        {{ getInitials(props.owner.name || '-') }}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div class="space-y-1">
                                                    <h4 class="text-sm font-semibold">
                                                        {{ props.owner.name || '-' }}
                                                    </h4>
                                                    <p class="text-sm">
                                                        {{ props.owner.email || '-' }}
                                                    </p>
                                                </div>
                                            </div>
                                        </HoverCardContent>
                                    </HoverCard>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent class="w-48 max-w-full sm:w-52">
                <ContextMenuItem v-if="onClickInfo" @select="_onClickInfo" class="menu-item">
                    <Info class="!size-4" />
                    <span>Info</span>
                </ContextMenuItem>
                <template v-if="type === 'folder'">
                    <ContextMenuItem
                        v-if="onClickNewFile"
                        @select="_onClickNewFile"
                        class="menu-item"
                    >
                        <FilePlus class="!size-4" />
                        <span>New file</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                        v-if="onClickNewFolder"
                        @select="_onClickNewFolder"
                        class="menu-item"
                    >
                        <FolderPlus class="!size-4" />
                        <span>New folder</span>
                    </ContextMenuItem>
                </template>
                <template v-if="type === 'file'">
                    <ContextMenuItem
                        v-if="props.fileUrl && onClickDownload"
                        @select="_onClickDownload"
                        class="menu-item"
                    >
                        <Download class="!size-4" />
                        <span>Download</span>
                    </ContextMenuItem>
                </template>
                <ContextMenuItem
                    v-if="onClickEdit"
                    @select="_onClickEdit"
                    class="menu-item menu-item-edit"
                >
                    <FolderPen v-if="props.type === 'folder'" class="!size-4" />
                    <FilePen v-else class="!size-4" />
                    <span>Edit</span>
                </ContextMenuItem>
                <ContextMenuItem
                    v-if="onClickDelete"
                    @select="_onClickDelete"
                    class="menu-item menu-item-delete"
                >
                    <Trash2 class="!size-4" />
                    <span>Delete</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
        <template v-if="type === 'folder'">
            <div v-if="isOpen" class="border-l border-border pl-4 mt-2">
                <div v-if="props.children && props.children.length > 0" class="flex flex-col gap-2">
                    <FolderItem
                        v-for="child in props.children"
                        v-bind="child"
                        :is-open="props.isOpen"
                        :key="child.keyValue"
                    />
                </div>
                <div v-else class="text-sm text-gray-500">No data available.</div>
            </div>
        </template>
    </div>
</template>

<style scoped>
.menu-item {
    @apply gap-4;
}

.menu-item.menu-item-edit {
    @apply text-warning;
}

.menu-item.menu-item-delete {
    @apply text-destructive;
}
</style>
