import { footerNavItemsRaw, mainNavItemsRaw } from '@/lib/menus'
import { filterNavGroups } from '@/lib/utils'

interface UseMenu {
    permissions?: string[]
}

export const useMenu = (options?: UseMenu) => {
    const mainNavItems = filterNavGroups(mainNavItemsRaw, options?.permissions)
    const footerNavItems = filterNavGroups(footerNavItemsRaw, options?.permissions)

    const allNavItems = [...mainNavItems, ...footerNavItems]
    const allNavItemsWithoutGroups = [...mainNavItems, ...footerNavItems].flatMap(
        (group) => group.items,
    )
    return {
        mainNavItems,
        footerNavItems,
        allNavItems,
        allNavItemsWithoutGroups,
    }
}
