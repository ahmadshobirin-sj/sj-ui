<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import AuthLayout from '@/layouts/auth/AuthSimpleLayout.vue'

defineProps<{
    title?: string
    description?: string
}>()
</script>

<template>
    <Toaster rich-colors close-button />
    <AuthLayout :title="title" :description="description">
        <slot />
    </AuthLayout>
</template>
