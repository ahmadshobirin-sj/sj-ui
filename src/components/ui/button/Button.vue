<script setup lang="ts">
import { cn } from '@/lib/utils'
import { Primitive, type PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { buttonVariants, type ButtonVariants } from '.'
import { Loader2, type LucideIcon } from 'lucide-vue-next'

interface Props extends PrimitiveProps {
    variant?: ButtonVariants['variant']
    severity?: ButtonVariants['severity']
    size?: ButtonVariants['size']
    loading?: boolean
    disabled?: boolean
    class?: HTMLAttributes['class']
    iconStart?: LucideIcon
    iconEnd?: LucideIcon
}

const props = withDefaults(defineProps<Props>(), {
    as: 'button',
})
</script>

<template>
    <Primitive :as="as" :as-child="asChild" :class="cn(buttonVariants({ variant, size, severity }), props.class)"
        :disabled="disabled || loading">
        <template v-if="loading">
            <Loader2 class="animate-spin" />
        </template>
        <template v-else-if="iconStart">
            <component :is="iconStart" />
        </template>
        <template v-else>
            <slot name="left" />
        </template>

        <slot />

        <template v-if="iconEnd">
            <component :is="iconEnd" />
        </template>
        <template v-else>
            <slot name="right" />
        </template>
    </Primitive>
</template>
