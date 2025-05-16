<script setup lang="ts">
import { Label, type LabelProps } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const { class: className, ...props } = defineProps<LabelProps>()
</script>

<template>
    <Label
        v-bind="props"
        :class="cn('group-data-[has-error=true]/manual-form:text-destructive', className)"
    >
        <slot />
    </Label>
</template>
