import type { HTMLAttributes } from 'vue'

export { default as AppDropdownMenu } from './AppDropdownMenu.vue'

export interface AppDropdownMenuProps {
    items: AppDropdownMenuItemType[]
    classContent?: HTMLAttributes['class']
}

export type AppDropdownMenuItemType =
    | {
          type: 'label'
          label: string
      }
    | {
          type: 'separator'
      }
    | {
          type: 'item'
          label: string
          icon?: any
          shortcut?: string
          disabled?: boolean
          onClick?: () => void
      }
    | {
          type: 'group'
          children: AppDropdownMenuItemType[]
      }
    | {
          type: 'sub'
          label: string
          icon?: any
          children: AppDropdownMenuItemType[]
      }
