<script setup lang="ts">
interface Props {
    error?: boolean
}

const props = defineProps<Props>()
</script>

<template>
    <div :data-has-error="props.error" class="group/manual-form flex flex-col gap-2 group">
        <slot />
    </div>
</template>
