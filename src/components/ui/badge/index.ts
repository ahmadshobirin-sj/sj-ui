import { cva, type VariantProps } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

export const badgeVariants = cva(
    'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            severity: {
                primary: '',
                secondary: '',
                success: '',
                info: '',
                warning: '',
                destructive: '',
            },
            variant: {
                filled: '',
                outline: 'border',
            },
        },
        compoundVariants: [
            {
                severity: 'primary',
                variant: 'filled',
                class: 'bg-primary text-primary-foreground hover:bg-primary/80',
            },
            {
                severity: 'primary',
                variant: 'outline',
                class: 'border-primary text-primary hover:bg-primary/10',
            },
            {
                severity: 'secondary',
                variant: 'filled',
                class: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            },
            {
                severity: 'secondary',
                variant: 'outline',
                class: 'border-secondary text-secondary-foreground hover:bg-secondary/10',
            },
            {
                severity: 'success',
                variant: 'filled',
                class: 'bg-success text-success-foreground hover:bg-success/80',
            },
            {
                severity: 'success',
                variant: 'outline',
                class: 'border-success text-success hover:bg-success/10',
            },
            {
                severity: 'info',
                variant: 'filled',
                class: 'bg-info text-info-foreground hover:bg-info/80',
            },
            {
                severity: 'info',
                variant: 'outline',
                class: 'border-info text-info hover:bg-info/10',
            },
            {
                severity: 'warning',
                variant: 'filled',
                class: 'bg-warning text-warning-foreground hover:bg-warning/80',
            },
            {
                severity: 'warning',
                variant: 'outline',
                class: 'border-warning text-warning hover:bg-warning/10',
            },
            {
                severity: 'destructive',
                variant: 'filled',
                class: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
            },
            {
                severity: 'destructive',
                variant: 'outline',
                class: 'border-destructive text-destructive hover:bg-destructive/10',
            },
        ],
        defaultVariants: {
            severity: 'primary',
            variant: 'filled',
        },
    },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
