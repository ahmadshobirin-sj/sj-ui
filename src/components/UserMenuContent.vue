<script setup lang="ts">
import UserInfo from '@/components/UserInfo.vue'
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { User } from '@/types'
import { LogOut, Settings } from 'lucide-vue-next'

interface Props {
    user: User | null
}

defineProps<Props>()
</script>

<template>
    <DropdownMenuLabel class="p-0 font-normal">
        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <UserInfo :user="user" :show-email="true" />
        </div>
    </DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
        <DropdownMenuItem :as-child="true">
            <a class="block w-full" href="#" as="button">
                <Settings class="mr-2 h-4 w-4" />
                Settings
            </a>
        </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem :as-child="true">
        <a class="block w-full" method="post" href="#" as="button">
            <LogOut class="mr-2 h-4 w-4" />
            Log out
        </a>
    </DropdownMenuItem>
</template>
