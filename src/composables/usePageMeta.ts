import type { BreadcrumbItem, MetaNav, NavItem } from '@/types'
import { computed } from 'vue'
import { useMenu } from './useMenu'

function findBreadcrumb(
    items: NavItem[],
    targetRoute: string,
    trail: BreadcrumbItem[] = [],
): MetaNav | null {
    for (const item of items) {
        const currentTrail = [...trail, { title: item.title, href: item.href }]

        if (item.href && item.href.includes(targetRoute)) {
            return {
                pageTitle: item.title,
                breadcrumbs: currentTrail,
            }
        }

        if (item.items) {
            const found = findBreadcrumb(item.items, targetRoute, currentTrail)
            if (found) return found
        }
    }
    return null
}

export function usePageMeta(currentRoute: string, customMeta?: MetaNav) {
    const { allNavItems } = useMenu()

    const defaultMeta = computed<MetaNav>(() => {
        for (const group of allNavItems) {
            const found = findBreadcrumb(group.items, currentRoute)
            if (found) return found
        }

        return {
            pageTitle: 'Untitled',
            breadcrumbs: [],
        }
    })

    const meta = computed<MetaNav>(() => ({
        pageTitle: customMeta?.pageTitle ?? defaultMeta.value.pageTitle,
        breadcrumbs: customMeta?.breadcrumbs ?? defaultMeta.value.breadcrumbs,
    }))

    return meta.value
}
