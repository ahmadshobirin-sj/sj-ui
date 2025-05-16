import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { NavGroup, NavItem } from '@/types'
import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import { toast } from 'vue-sonner'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
    ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

export function filterItems(items: NavItem[], permissions?: string[]): NavItem[] {
    return items
        .map((item) => {
            if (item.items) {
                const filteredChildren = filterItems(item.items, permissions)
                return {
                    ...item,
                    items: filteredChildren.length ? filteredChildren : undefined,
                }
            }
            return item
        })
        .filter((item) => {
            const itemPermission = item.meta?.permission
            return (
                !item.hidden &&
                (!item.items || item.items.length > 0) &&
                (permissions && itemPermission ? permissions.includes(itemPermission) : true)
            )
        })
}

export function filterNavGroups(groups: NavGroup[], permissions?: string[]): NavGroup[] {
    return groups
        .map((group) => {
            const filteredItems = filterItems(group.items, permissions)
            return { ...group, items: filteredItems }
        })
        .filter((group) => group.items.length > 0)
}

export async function downloadFile(url: string) {
    const pattern = /^(ftp|http|https):\/\/[^ "]+$/
    if (!pattern.test(url)) {
        toast.error('Invalid URL')
        return
    }
    try {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error('Network response was not ok')
        }

        const blob = await res.blob()
        const extension = extensionFileFromUrl(url) || 'file'
        const tempUrl = URL.createObjectURL(blob)

        const anchor = document.createElement('a')
        anchor.href = tempUrl
        anchor.download = `downloaded_file.${extension}`
        document.body.appendChild(anchor)
        anchor.click()
        anchor.remove()

        URL.revokeObjectURL(tempUrl)
    } catch (err: any) {
        const isCorsError = err instanceof TypeError && err.message === 'Failed to fetch'

        if (isCorsError) {
            window.open(url, '_blank')
            toast.info('Not allowed to download this file, opening in new tab', {
                position: 'top-right',
            })
        } else {
            console.error('Download error:', err)
            toast.error('Failed to download file', { position: 'top-right' })
        }
    }
}
export function extensionFileFromUrl(url: string) {
    const match = url.match(/\.[0-9a-z]+$/i)
    return match ? match[0].slice(1) : ''
}
