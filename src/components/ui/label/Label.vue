<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Label } from 'reka-ui'
import { computed } from 'vue'
import { type LabelProps } from '.'

const props = defineProps<LabelProps>()

const delegatedProps = computed(() => {
    const { class: _, ...delegated } = props

    return delegated
})
</script>

<template>
    <Label
        v-bind="delegatedProps"
        :class="
            cn(
                'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                props.class,
            )
        "
    >
        <slot />
    </Label>
</template>
