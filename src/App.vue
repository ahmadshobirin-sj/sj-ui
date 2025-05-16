<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue'
import { PageContainer } from '@/components/ui/page-container'
import { useGlobalStore } from './stores/global'

const store = useGlobalStore()

store.setApp({
    name: 'Starter Kit',
    version: '1.0.0',
    description: 'A starter kit for Scanjet Apps',
    logo: 'https://avatar.iran.liara.run/public',
})
store.setUser({
    name: 'Admin',
    email: 'admin@mail.com',
    avatar: 'https://avatar.iran.liara.run/public/boy',
})
</script>

<template>
    <AppLayout>
        <PageContainer> dd </PageContainer>
    </AppLayout>
</template>

<style scoped></style>
