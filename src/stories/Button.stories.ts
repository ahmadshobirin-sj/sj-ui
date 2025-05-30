import { fn } from '@storybook/test'
import { TrashIcon, EditIcon } from 'lucide-vue-next'

import type { Meta, StoryObj } from '@storybook/vue3'

import { Button } from '@/components/ui/button'

const meta = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    render: (args: any) => ({
        components: { Button },
        setup() {
            return { args }
        },
        template: '<Button v-bind="args">Click Me</Button>',
    }),
    args: {
        variant: 'filled',
        severity: 'primary',
        size: 'default',
    },
    argTypes: {
        variant: { control: 'select', options: ['filled', 'outline', 'ghost'] },
        size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
        class: { control: 'text' },
        as: { control: 'text' },
        iconStart: {
            control: 'select',
            options: ['', 'TrashIcon', 'EditIcon'],
            mapping: {
                TrashIcon: TrashIcon,
                EditIcon: EditIcon,
            },
        },
        iconEnd: {
            control: 'select',
            options: ['', 'TrashIcon', 'EditIcon'],
            mapping: {
                TrashIcon: TrashIcon,
                EditIcon: EditIcon,
            },
        },
    },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Default: Story = {}
