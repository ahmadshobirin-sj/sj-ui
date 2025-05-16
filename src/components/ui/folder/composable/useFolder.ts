import { downloadFile } from '@/lib/utils'
import { formatDate as vueUseFormatDate } from '@vueuse/core'
import { computed, inject, provide, ref, watchEffect } from 'vue'
import { toast } from 'vue-sonner'
import {
    type FolderItemProps,
    type FolderItemType,
    type FolderProps,
    type FolderProvider,
    FolderProviderSymbol,
} from '..'

export function useFolder({ treeData, ...props }: FolderProps) {
    const showFormModal: FolderProvider['showFormModal'] = ref(false)
    const showDeleteModal: FolderProvider['showDeleteModal'] = ref(false)
    const folderSelected: FolderProvider['folderSelected'] = ref()
    const rowsSelected: FolderProvider['rowsSelected'] = ref([])
    const data: FolderProvider['data'] = ref([])
    const folderFormType: FolderProvider['folderFormType'] = ref('folder')
    const folderFormModeType: FolderProvider['folderFormModeType'] = ref('create')
    const showInfoModal: FolderProvider['showInfoModal'] = ref(false)

    watchEffect(() => {
        if (treeData && treeData.length > 0) {
            data.value = treeData
        }
    })

    const findUserById: FolderProvider['findUserById'] = (id) => {
        if (props.members) {
            const user = props.members.find((user) => user.id === id)
            return user ?? null
        }
        return null
    }

    function findItemByKey(
        items: FolderItemProps[],
        key: string,
        options: {
            keyName?: string
            type?: FolderItemType
            excludeKeyValue?: string
        } = {},
    ): FolderItemProps | null {
        const { keyName = 'keyValue', type, excludeKeyValue } = options
        const stack = [...items]

        while (stack.length > 0) {
            const item = stack.pop()!
            if (excludeKeyValue && item.keyValue === excludeKeyValue) continue
            if (type && item.type !== type) continue
            if (item[keyName] === key) {
                return item
            }
            if (item.children) {
                stack.push(...item.children)
            }
        }

        return null
    }

    function getAllKeyValues(item: FolderItemProps): string[] {
        const result: string[] = []
        const stack: FolderItemProps[] = [item]

        while (stack.length > 0) {
            const current = stack.pop()!
            if (current.isDisabled) continue

            result.push(current.keyValue)

            if (current.children) {
                stack.push(...current.children)
            }
        }

        return result
    }

    const onCreateItem: FolderProvider['onCreateItem'] = (value, type) => {
        const keyValue = value.name + '-' + data.value.length + 1
        const existingItem = findItemByKey(data.value, value.name, {
            keyName: 'name',
            type: type,
        })

        const title = type === 'folder' ? 'Folder' : 'File'

        if (existingItem) {
            toast.error(`${title} the already exists`, {
                description: `Please choose a different name.`,
                position: 'top-left',
            })
            return
        }

        const findOwner = findUserById(value.owner.id)

        const findMembers = value.members.map((member: any) => {
            const findMember = findUserById(member.id)
            if (findMember) return findMember
            return null
        })

        const members = findMembers.length > 0 ? findMembers : undefined

        const newItem: FolderItemProps = {
            keyValue: keyValue,
            name: value.name,
            type: type,
            owner: findOwner || undefined,
            members: members,
            date: new Date().toISOString(),
            description: value.description,
            fileUrl: value.fileUrl,
            children: [],
            parentKey: value.parentKey,
        }

        if (folderSelected.value) {
            const parentItem = findItemByKey(data.value, folderSelected.value.keyValue)
            if (parentItem) {
                parentItem.children?.push(newItem)
            }
        } else {
            data.value.push(newItem)
        }

        onResetForm()
    }

    const onEditItem: FolderProvider['onEditItem'] = (value, type) => {
        const existingItem = findItemByKey(data.value, value.keyValue)

        if (!existingItem) {
            toast.error(`Item not found`, {
                description: `The item you are trying to edit doesn't exist.`,
                position: 'top-left',
            })
            return
        }

        // Cek apakah ada nama yang sama di level yang sama
        const duplicateItem = findItemByKey(data.value, value.name, {
            keyName: 'name',
            type: type,
            excludeKeyValue: value.keyValue,
        })

        const title = type === 'folder' ? 'Folder' : 'File'

        if (duplicateItem) {
            toast.error(`${title} already exists`, {
                description: `Please choose a different name.`,
                position: 'top-left',
            })
            return
        }

        const findOwner = findUserById(value.owner.id)

        if (!findOwner) {
            toast.error(`Owner not found`, {
                description: `The owner you are trying to edit doesn't exist.`,
                position: 'top-left',
            })
            return
        }

        const findMembers = value.members.map((member: any) => {
            const findMember = findUserById(member.id)
            return findMember || null
        })

        existingItem.name = value.name
        existingItem.type = type
        existingItem.owner = findOwner || undefined
        existingItem.members = findMembers.length > 0 ? findMembers : undefined
        existingItem.description = value.description
        existingItem.fileUrl = value.fileUrl
        existingItem.parentKey = value.parentKey

        onResetForm()
    }

    const onDeleteItem: FolderProvider['onDeleteItem'] = () => {
        if (!folderSelected.value) {
            toast.error('Please select an item to delete', {
                description: `You must select an item to delete.`,
                position: 'top-left',
            })
            return
        }

        const id = folderSelected.value.keyValue
        const existingItem = findItemByKey(data.value, id)

        if (!existingItem) {
            toast.error(`Item not found`, {
                description: `The item you are trying to delete doesn't exist.`,
                position: 'top-left',
            })
            return
        }

        data.value = data.value.filter((item) => item.keyValue !== id)
        onCloseDeleteModal(false)

        onResetForm()
    }

    const onClickEdit: FolderProvider['onClickEdit'] = (item) => {
        folderSelected.value = item
        showFormModal.value = true
        folderFormType.value = item.type
        folderFormModeType.value = 'edit'
    }

    const onClickNewFile: FolderProvider['onClickNewFile'] = (type, item) => {
        if (item) folderSelected.value = item
        showFormModal.value = true
        folderFormType.value = type
        folderFormModeType.value = 'create'
    }

    const onClickNewFolder: FolderProvider['onClickNewFolder'] = (type, item) => {
        console.log('onClickNewFolder', type, item)
        if (item) folderSelected.value = item
        showFormModal.value = true
        folderFormType.value = type
        folderFormModeType.value = 'create'
    }

    const onClickDelete: FolderProvider['onClickDelete'] = (item) => {
        folderSelected.value = item
        showDeleteModal.value = true
    }

    const onToggleSelect: FolderProvider['onToggleSelect'] = (keyValue, parentKey, parentKeys) => {
        const item = findItemByKey(data.value, keyValue)
        if (!item) return

        const keysToToggle = getAllKeyValues(item)
        const isCurrentlySelected = rowsSelected.value.includes(keyValue)

        if (isCurrentlySelected) {
            if (parentKey == null) {
                rowsSelected.value = rowsSelected.value.filter((key) => !keysToToggle.includes(key))
            } else {
                const keysToRemove = [...keysToToggle]

                const index = parentKeys.indexOf(parentKey)
                if (index !== -1) {
                    keysToRemove.push(...parentKeys.slice(0, index + 1))
                }

                const uniqueKeysToRemove = [...new Set(keysToRemove)]
                rowsSelected.value = rowsSelected.value.filter(
                    (key) => !uniqueKeysToRemove.includes(key),
                )
            }
        } else {
            const set = new Set(rowsSelected.value)
            keysToToggle.forEach((key) => set.add(key))
            rowsSelected.value = Array.from(set)
        }
    }

    const onClickDownload: FolderProvider['onClickDownload'] = (item) => {
        const fileUrl = item.fileUrl
        if (fileUrl) {
            downloadFile(fileUrl)
        }
    }

    const onClickInfo: FolderProvider['onClickInfo'] = (item) => {
        console.log('onClickInfo', item)
        showInfoModal.value = true
        folderSelected.value = item
    }

    const onCloseInfoModal: FolderProvider['onCloseInfoModal'] = (value) => {
        showInfoModal.value = value
        folderSelected.value = undefined
    }

    const onCloseFormModal: FolderProvider['onCloseFormModal'] = (value) => {
        showFormModal.value = value
    }

    const onCloseDeleteModal: FolderProvider['onCloseDeleteModal'] = (value) => {
        showDeleteModal.value = value
        folderSelected.value = undefined
    }

    const onResetForm = () => {
        folderSelected.value = undefined
        // folderFormModeType.value = 'create';
        // folderFormType.value = 'folder';
    }

    const totalRowsSelected = computed(() => rowsSelected.value.length)

    return {
        // State
        showFormModal,
        showDeleteModal,
        showInfoModal,
        folderSelected,
        data,
        folderFormModeType,
        folderFormType,
        rowsSelected,

        // user: props.user,
        // members: props.members,
        // enablePermissions: props.enablePermissions,
        ...props,

        // Computed
        totalRowsSelected,

        // Events
        onCreateItem,
        onEditItem,
        onDeleteItem,
        onClickEdit,
        onClickDelete,
        onClickNewFile,
        onClickNewFolder,
        onToggleSelect,
        onClickDownload,
        onClickInfo,

        // Other Events
        onCloseFormModal,
        findUserById,
        onCloseInfoModal,
        onCloseDeleteModal,
    }
}

export const providerFolderContext = (params: FolderProvider) => {
    provide(FolderProviderSymbol, params)
}

export const useFolderContext = () => {
    const context = inject<FolderProvider>(FolderProviderSymbol)
    if (!context) {
        throw new Error('useFolderContext must be used within a FolderProvider')
    }
    return context
}

export const formatDate = (date: string) => {
    return vueUseFormatDate(new Date(date), 'DD MMM YYYY, HH:mm')
}
