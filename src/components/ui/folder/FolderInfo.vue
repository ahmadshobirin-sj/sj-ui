<script setup lang="ts">
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetMain,
} from '@/components/ui/sheet'
import { formatDate, useFolderContext } from './composable/useFolder'
import { ManualFormField, ManualFormLabel } from '@/components/ui/manual-form'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/composables/useInitials'
import { Button } from '@/components/ui/button'

const { showInfoModal, onCloseInfoModal, folderSelected } = useFolderContext()
</script>

<template>
    <Sheet :open="showInfoModal" @update:open="onCloseInfoModal">
        <SheetContent class="w-full">
            <SheetHeader>
                <div class="flex gap-2 items-center">
                    <div v-if="folderSelected?.type === 'folder'" class="self-start">
                        <svg
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
                    <div>
                        <span class="text-lg font-medium">{{ folderSelected?.name }}</span>
                    </div>
                </div>
            </SheetHeader>
            <SheetMain>
                <div class="space-y-8">
                    <ManualFormField>
                        <ManualFormLabel>Description</ManualFormLabel>
                        <p class="text-sm">{{ folderSelected?.description || '-' }}</p>
                    </ManualFormField>
                    <ManualFormField>
                        <ManualFormLabel>Date</ManualFormLabel>
                        <p class="text-sm">{{ formatDate(folderSelected?.date || '') }}</p>
                    </ManualFormField>
                    <template v-if="folderSelected?.type === 'file'">
                        <ManualFormField>
                            <ManualFormLabel>Type</ManualFormLabel>
                            <p class="text-sm">{{ folderSelected?.mimeType || 'File' }}</p>
                        </ManualFormField>
                        <ManualFormField>
                            <ManualFormLabel>Size</ManualFormLabel>
                            <p class="text-sm">{{ folderSelected?.size || '-' }}</p>
                        </ManualFormField>
                    </template>
                    <ManualFormField>
                        <ManualFormLabel>Owner</ManualFormLabel>
                        <div class="flex space-x-4 items-center">
                            <Avatar size="xs">
                                <AvatarFallback class="font-semibold">
                                    {{ getInitials(folderSelected?.owner?.name || '-') }}
                                </AvatarFallback>
                            </Avatar>
                            <div class="space-y-1">
                                <h4 class="text-xs font-semibold">
                                    {{ folderSelected?.owner?.name || '-' }}
                                </h4>
                                <p class="text-xs">
                                    {{ folderSelected?.owner?.email || '-' }}
                                </p>
                            </div>
                        </div>
                    </ManualFormField>
                    <ManualFormField
                        v-if="folderSelected?.members && folderSelected?.members.length > 0"
                    >
                        <ManualFormLabel>Members</ManualFormLabel>
                        <div class="space-y-4">
                            <div
                                v-for="member in folderSelected?.members"
                                :key="member.id"
                                class="flex space-x-4 items-center"
                            >
                                <Avatar size="xs">
                                    <AvatarFallback class="font-semibold">
                                        {{ getInitials(member.name || '-') }}
                                    </AvatarFallback>
                                </Avatar>
                                <div class="space-y-1">
                                    <h4 class="text-xs font-semibold">
                                        {{ member.name || '-' }}
                                    </h4>
                                    <p class="text-xs">
                                        {{ member.email || '-' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ManualFormField>
                </div>
            </SheetMain>
            <SheetFooter>
                <SheetClose>
                    <Button severity="secondary" variant="ghost"> Close </Button>
                </SheetClose>
            </SheetFooter>
        </SheetContent>
    </Sheet>
</template>
