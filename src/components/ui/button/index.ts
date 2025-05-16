import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                filled: '',
                outline: '',
                ghost: '',
            },
            severity: {
                primary: '',
                secondary: '',
                destructive: '',
                info: '',
                warning: '',
                success: '',
            },
            size: {
                default: 'h-9 px-4 py-2',
                sm: 'h-8 rounded-md px-3 text-xs',
                lg: 'h-10 rounded-md px-8',
                icon: 'h-9 w-9',
            },
        },
        compoundVariants: [
            // Default
            {
                variant: 'filled',
                severity: 'primary',
                class: 'bg-primary text-primary-foreground hover:bg-primary/90',
            },
            {
                variant: 'outline',
                severity: 'primary',
                class: 'border border-primary text-primary hover:bg-primary/10',
            },
            { variant: 'ghost', severity: 'primary', class: 'text-primary hover:bg-primary/10' },

            // Secondary
            {
                variant: 'filled',
                severity: 'secondary',
                class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            },
            {
                variant: 'outline',
                severity: 'secondary',
                class: 'border border-secondary text-secondary-foreground hover:bg-secondary/10',
            },
            {
                variant: 'ghost',
                severity: 'secondary',
                class: 'text-secondary-foreground hover:bg-secondary',
            },

            // Destructive
            {
                variant: 'filled',
                severity: 'destructive',
                class: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            },
            {
                variant: 'outline',
                severity: 'destructive',
                class: 'border border-destructive text-destructive hover:bg-destructive/10',
            },
            {
                variant: 'ghost',
                severity: 'destructive',
                class: 'text-destructive hover:bg-destructive/10',
            },

            // Info
            {
                variant: 'filled',
                severity: 'info',
                class: 'bg-info text-info-foreground hover:bg-info/90',
            },
            {
                variant: 'outline',
                severity: 'info',
                class: 'border border-info text-info hover:bg-info/10',
            },
            { variant: 'ghost', severity: 'info', class: 'text-info hover:bg-info/10' },

            // Warning
            {
                variant: 'filled',
                severity: 'warning',
                class: 'bg-warning text-warning-foreground hover:bg-warning/90',
            },
            {
                variant: 'outline',
                severity: 'warning',
                class: 'border border-warning text-warning hover:bg-warning/10',
            },
            { variant: 'ghost', severity: 'warning', class: 'text-warning hover:bg-warning/10' },

            // Success
            {
                variant: 'filled',
                severity: 'success',
                class: 'bg-success text-success-foreground hover:bg-success/90',
            },
            {
                variant: 'outline',
                severity: 'success',
                class: 'border border-success text-success hover:bg-success/10',
            },
            { variant: 'ghost', severity: 'success', class: 'text-success hover:bg-success/10' },
        ],
        defaultVariants: {
            variant: 'filled',
            severity: 'primary',
            size: 'default',
        },
    },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
