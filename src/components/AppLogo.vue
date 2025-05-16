<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue'
import { useGlobalStore } from '@/stores/global';

const { app } = useGlobalStore()
</script>

<template>
    <div
        class="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <AppLogoIcon :logo="app?.logo" class="size-5 fill-current rounded-md text-white dark:text-black" />
    </div>
    <div class="ml-1 grid flex-1 text-left text-sm">
        <span class="mb-0.5 truncate font-semibold leading-none">
            {{ app?.name || 'Applications' }}
        </span>
    </div>
</template>
