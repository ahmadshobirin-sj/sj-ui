<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useFolderContext } from './composable/useFolder'

const { onCloseDeleteModal, showDeleteModal, onDeleteItem } = useFolderContext()
</script>

<template>
    <AlertDialog :open="showDeleteModal" @update:open="onCloseDeleteModal">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle> Are you absolutely sure want to delete? </AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the account and
                    remove the data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button severity="destructive" @click="onDeleteItem">Continue</Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
