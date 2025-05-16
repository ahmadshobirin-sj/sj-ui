<script setup lang="ts">
import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'vue'

defineOptions({
    inheritAttrs: false,
})

interface Props {
    logo?: string
    class?: HTMLAttributes['class']
}

const { class: className } = defineProps<Props>()
</script>

<template>
    <img :src="logo" alt="Logo" :class="cn(className, 'h-8 w-8')" />
</template>
