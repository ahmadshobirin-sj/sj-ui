import { type Ref } from 'vue'

export { default as Folder } from './Folder.vue'
export { default as FolderItem } from './FolderItem.vue'

export type FolderItemType = 'folder' | 'file'
export type FolderItemViewType = 'Icon' | 'List'
export type FolderFormModeType = 'create' | 'edit'

export const FolderProviderSymbol = Symbol('FolderProvider')

export interface FolderProps {
    viewType?: FolderItemViewType
    treeData: FolderItemProps[]
    expandAll?: boolean
    user: FolderUserProps
    members?: FolderUserProps[]
    permissions?: FolderPermissionProps
    enablePermissions?: boolean
    assignMembersToFileOnly?: boolean
}

export interface FolderUserProps {
    id: string
    email: string
    name: string
}

export interface FolderRoleProps {
    owner?: FolderUserProps
    members?: FolderUserProps[]
}

export interface FolderPermissionProps {
    canEdit?: boolean
    canDownload?: boolean
    canShare?: boolean
    canUpload?: boolean
    canCreate?: boolean
    canViewAll?: boolean
    canView?: boolean
    canSelect?: boolean
    canDelete?: boolean
}

export interface FolderItemProps extends FolderRoleProps {
    keyValue: string
    viewType?: FolderItemViewType
    name: string
    type: FolderItemType
    size?: string
    date?: string
    children?: FolderItemProps[]
    fileUrl?: string
    mimeType?: string
    isOpen?: boolean
    isLoading?: boolean
    isDisabled?: boolean
    description?: string
    parentKey: string | null
    isPublic?: boolean
    [key: string]: any
}

export interface FolderProvider extends Omit<FolderProps, 'treeData'> {
    // State
    showFormModal: Ref<boolean, boolean>
    showDeleteModal: Ref<boolean, boolean>
    showInfoModal: Ref<boolean, boolean>
    folderSelected: Ref<FolderItemProps | undefined, FolderItemProps | undefined>
    rowsSelected: Ref<string[], string[]>
    data: Ref<FolderItemProps[], FolderItemProps[]>
    folderFormType: Ref<FolderItemType, FolderItemType>
    folderFormModeType: Ref<FolderFormModeType, FolderFormModeType>

    // user?: FolderUserProps;
    // members?: FolderUserProps[];
    // enableMembers?: FolderProps['enableMembers'];
    // enablePermissions?: FolderProps['enablePermissions'];
    // assignMembersToFileOnly?: FolderProps['assignMembersToFileOnly'];

    // Computed
    totalRowsSelected: Ref<number, number>

    // Events
    onCreateItem: (value: any, type: FolderItemType) => void
    onEditItem: (value: any, type: FolderItemType) => void
    onDeleteItem: () => void
    onClickNewFolder?: (type: 'folder', item?: FolderItemProps) => void
    onClickNewFile?: (type: 'file', item?: FolderItemProps) => void
    onClickEdit?: (item: FolderItemProps) => void
    onClickDelete?: (item: FolderItemProps) => void
    onClickDownload?: (item: FolderItemProps) => void
    onClickMove?: (item: FolderItemProps) => void
    onToggleSelect?: (key: string, parentKey: string | null, parentKeys: string[]) => void
    onClickInfo?: (item: FolderItemProps) => void

    // Other Events
    onCloseFormModal: (value: boolean) => void
    findUserById: (id: string) => FolderUserProps | null
    onCloseInfoModal: (value: boolean) => void
    onCloseDeleteModal: (value: boolean) => void
}

export interface FolderState {
    rowsSelected?: Ref<string[], string[]>
}

export const defaultData: FolderItemProps[] = [
    {
        name: 'Industrial',
        type: 'folder',
        keyValue: '1',
        date: '01/01/2025',
        isDisabled: false,
        parentKey: null,
        isPublic: false,
        owner: { id: '1', name: 'John Doe', email: 'john@email.com' },
        children: [
            {
                name: 'File PDF',
                type: 'file',
                mimeType: 'PDF',
                keyValue: '2',
                date: '02/01/2025',
                size: '10 MB',
                owner: {
                    id: '5',
                    name: 'Kim',
                    email: 'kim@email.com',
                },
                isDisabled: true,
                parentKey: '1',
            },
            {
                name: 'File PDF Not Disabled',
                type: 'file',
                mimeType: 'PDF',
                keyValue: '5',
                date: '02/01/2025',
                size: '10 MB',
                owner: {
                    id: '5',
                    name: 'Kim',
                    email: 'kim@email.com',
                },
                fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                isDisabled: false,
                parentKey: '1',
            },
            {
                name: 'Marine',
                type: 'folder',
                keyValue: '8',
                date: '01/01/2025',
                parentKey: '1',
                children: [
                    {
                        name: 'Awwww',
                        type: 'folder',
                        keyValue: '6',
                        date: '02/01/2025',
                        parentKey: '8',
                        children: [
                            {
                                name: 'AWESOME',
                                type: 'folder',
                                keyValue: '12',
                                date: '01/01/2025',
                                parentKey: '8',
                                children: [
                                    {
                                        name: 'File PDF',
                                        type: 'file',
                                        mimeType: 'PDF',
                                        keyValue: '25',
                                        date: '02/01/2025',
                                        size: '10 MB',
                                        owner: {
                                            id: '5',
                                            name: 'Kim',
                                            email: 'kim@email.com',
                                        },
                                        parentKey: '12',
                                    },
                                    {
                                        name: 'File PDF Not Disabled',
                                        type: 'file',
                                        mimeType: 'PDF',
                                        keyValue: '28',
                                        date: '02/01/2025',
                                        size: '10 MB',
                                        owner: {
                                            id: '5',
                                            name: 'Kim',
                                            email: 'kim@email.com',
                                        },
                                        parentKey: '12',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: 'File PDF Not Disabled',
                        type: 'file',
                        mimeType: 'PDF',
                        keyValue: '7',
                        date: '02/01/2025',
                        size: '10 MB',
                        owner: {
                            id: '5',
                            name: 'Kim',
                            email: 'kim@email.com',
                        },
                        parentKey: '8',
                    },
                ],
            },
        ],
    },
    {
        name: 'Test',
        type: 'file',
        keyValue: '3',
        date: '02/01/2025',
        size: '10 MB',
        owner: { id: '1', name: 'John Doe', email: 'john@email.com' },
        members: [
            {
                id: '2',
                name: 'John',
                email: 'john@mail.com',
            },
            {
                id: '3',
                name: 'Kane',
                email: 'kane@mail.com',
            },
        ],
        parentKey: null,
    },
]

// ======================
// ERROR MESSAGE CONSTANTS
// ======================
export const ERROR_MESSAGES = {
    REQUIRED: {
        DEFAULT: 'This field is required',
        OWNER_ID: 'Owner ID is required',
        MEMBER_ID: 'Member ID is required',
        NAME: 'Name is required',
        FILE_URL: 'File URL is required',
        FILE: 'Please upload a file',
        FILE_NAME: 'File name is required',
        FILE_SIZE: 'File size is required',
        FILE_TYPE: 'File type is required',
        OWNER_INFO: 'Owner information is required',
    },
    VALIDATION: {
        NAME_MAX_LENGTH: 'Name must be 255 characters or less',
        NAME_INVALID_CHARS: 'Name cannot contain special characters: / \\ : * ? " < > |',
        NAME_START_END: 'Name cannot start or end with space or dot',
        DESCRIPTION_MAX_LENGTH: 'Description must be 200 characters or less',
        INVALID_URL: 'Please enter a valid URL',
        INVALID_FILE: 'Please select a valid file',
        INVALID_FILE_TYPE: 'Unsupported file type. Please upload a valid file.',
        DUPLICATE_MEMBERS: 'Member list contains duplicate IDs',
    },
}
