import type { PageProps } from '@inertiajs/core'
import type { LucideIcon } from 'lucide-vue-next'
import type { Config } from 'ziggy-js'
import { User } from './model'

export interface BreadcrumbItem {
    title: string
    href: string
}

export interface NavItem {
    title: string
    href: string
    icon?: LucideIcon
    isActive?: boolean
    items?: NavItem[]
    hidden?: boolean
    meta?: {
        permission?: string
    }
}

export interface MetaNav {
    pageTitle?: string
    breadcrumbs?: BreadcrumbItem[]
}

export interface NavGroup {
    title: string
    items: NavItem[]
}

export type BreadcrumbItemType = BreadcrumbItem

export interface User {
    name: string
    email: string
    avatar?: string
}
