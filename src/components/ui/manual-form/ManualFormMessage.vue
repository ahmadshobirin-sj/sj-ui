<script setup lang="ts">
import { type HTMLAttributes } from 'vue'

const props = defineProps<{
    class?: HTMLAttributes['class']
    message?: string
}>()
</script>

<template>
    <p
        v-if="message"
        class="group-data-[has-error=true]/manual-form:text-destructive text-sm font-medium leading-none"
    >
        {{ props.message }}
    </p>
</template>
