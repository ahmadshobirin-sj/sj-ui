<script setup lang="ts">
import { cn } from '@/lib/utils'
import FolderItem from './FolderItem.vue'
import { Button } from '@/components/ui/button'
import { FilePlus, FolderPlus, Trash2 } from 'lucide-vue-next'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import FolderForm from './FolderForm.vue'
import FolderDelete from './FolderDelete.vue'
import { providerFolderContext, useFolder } from './composable/useFolder'
import { type FolderProps } from '.'
import FolderInfo from './FolderInfo.vue'

const props = defineProps<FolderProps>()

const folderRes = useFolder(props)

providerFolderContext(folderRes)

const { totalRowsSelected, onClickNewFile, onClickNewFolder, data } = folderRes
</script>

<template>
    <div class="flex items-center gap-2 justify-between px-4 py-2 border-b">
        <div>
            <span v-if="totalRowsSelected > 0"> {{ totalRowsSelected }} row(s) selected. </span>
        </div>
        <div class="flex items-center gap-2">
            <template v-if="totalRowsSelected > 0">
                <Tooltip :delay-duration="300">
                    <TooltipTrigger>
                        <Button variant="ghost" size="icon" severity="destructive">
                            <Trash2 class="!size-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Delete items</TooltipContent>
                </Tooltip>
            </template>
            <Tooltip :delay-duration="300">
                <TooltipTrigger>
                    <Button
                        variant="ghost"
                        size="icon"
                        severity="secondary"
                        @click="onClickNewFile?.('file')"
                    >
                        <FilePlus class="!size-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">New file on the root</TooltipContent>
            </Tooltip>
            <Tooltip :delay-duration="300">
                <TooltipTrigger>
                    <Button
                        variant="ghost"
                        size="icon"
                        severity="secondary"
                        @click="onClickNewFolder?.('folder')"
                    >
                        <FolderPlus class="!size-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">New folder on the root</TooltipContent>
            </Tooltip>
        </div>
    </div>

    <div :class="cn('mt-6')">
        <div v-if="data.length > 0" class="flex flex-col gap-4">
            <FolderItem
                v-for="folder in data"
                :key="folder.keyValue"
                v-bind="folder"
                :parent-key="null"
                :is-open="expandAll"
            />
        </div>
        <div v-else class="flex items-center justify-center h-96 bg-secondary rounded-md">
            <span>Let's create a new folder or file</span>
        </div>
    </div>

    <FolderForm />
    <FolderInfo />
    <FolderDelete />
</template>
