<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
    <div :class="cn('flex-1 px-6 py-4', props.class)">
        <slot />
    </div>
</template>
