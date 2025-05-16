<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetMain,
    SheetTitle,
} from '@/components/ui/sheet'
import Textarea from '@/components/ui/textarea/Textarea.vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import vueFilePond from 'vue-filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond/dist/filepond.min.css'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../form'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useFolderContext } from './composable/useFolder'
import { ERROR_MESSAGES, type FolderUserProps } from '.'
import { ManualFormField, ManualFormLabel } from '@/components/ui/manual-form'
import { cn } from '@/lib/utils'
import {
    Combobox,
    ComboboxAnchor,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxList,
    ComboboxTrigger,
} from '@/components/ui/combobox'
import { Check, ChevronsUpDown, Plus, Trash2 } from 'lucide-vue-next'

const {
    folderFormType: type,
    folderFormModeType: modeType,
    folderSelected: rowSelected,
    showFormModal,
    onCloseFormModal,
    onCreateItem,
    user,
    members,
    assignMembersToFileOnly,
    onEditItem,
} = useFolderContext()

const isFileUploadFromUrl = ref(true)
const selectedMembers = ref<FolderUserProps[]>([])
const selectedMember = ref<FolderUserProps | null>(null)

const FilePond = vueFilePond(FilePondPluginFileValidateType)

const handleUpdateFile = (fileItem: any) => {
    setFieldValue(
        'file',
        fileItem.map((item: any) => {
            return item.file
        }),
    )
}

const modalType = computed(() => type.value)

const modalTitle = computed(() => {
    const name = modalType.value === 'folder' ? 'Folder' : 'File'
    if (modeType.value === 'edit') {
        return `Edit ${name}`
    }
    return `New ${name}`
})

const showUploadFile = computed(() => {
    if (modeType.value === 'create' && modalType.value === 'file') return true
    return !rowSelected.value?.fileUrl && modalType.value === 'file'
})

const getUser = computed(() => {
    if (modeType.value === 'edit') return rowSelected.value?.owner
    return user
})

const ACCEPTED_MIME_TYPES = [
    'image/*',
    'video/*',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
]

const isAcceptedMimeType = (mime: string) => {
    return ACCEPTED_MIME_TYPES.some((pattern) => {
        if (pattern.endsWith('/*')) {
            return mime.startsWith(pattern.replace('/*', ''))
        }
        return mime === pattern
    })
}

const formOwnerSchema = yup.object({
    id: yup.string().required(ERROR_MESSAGES.REQUIRED.OWNER_ID),
})

const formMemberSchema = yup.object({
    id: yup.string().required(ERROR_MESSAGES.REQUIRED.MEMBER_ID),
})

const getFormSchema = (user?: FolderUserProps, isFileUploadFromUrl = { value: false }) => {
    return yup.object({
        keyValue: yup.string().when([], {
            is: () => modeType.value === 'edit',
            then: (schema) => schema.required(),
            otherwise: (schema) => schema.notRequired(),
        }),
        name: yup
            .string()
            .required(ERROR_MESSAGES.REQUIRED.NAME)
            .max(255, ERROR_MESSAGES.VALIDATION.NAME_MAX_LENGTH)
            .test('no-invalid-chars', ERROR_MESSAGES.VALIDATION.NAME_INVALID_CHARS, (val) =>
                val ? !/[\/\\:*?"<>|]/.test(val) : true,
            )
            .test('no-space-dot-start-end', ERROR_MESSAGES.VALIDATION.NAME_START_END, (val) =>
                val ? !/^[ .]|[ .]$/.test(val) : true,
            ),

        description: yup
            .string()
            .max(200, ERROR_MESSAGES.VALIDATION.DESCRIPTION_MAX_LENGTH)
            .optional(),

        parentKey: yup.string().nullable().typeError('Parent key must be a string or null'),

        fileUrl: yup.string().url(ERROR_MESSAGES.VALIDATION.INVALID_URL).optional(),

        file: yup
            .array()
            .of(
                yup
                    .mixed()
                    .required(ERROR_MESSAGES.REQUIRED.FILE)
                    .test('is-file-instance', ERROR_MESSAGES.VALIDATION.INVALID_FILE, (value) => {
                        return value instanceof File
                    })
                    .test(
                        'valid-mime-type',
                        ERROR_MESSAGES.VALIDATION.INVALID_FILE_TYPE,
                        (value) => {
                            if (!(value instanceof File)) return false
                            return isAcceptedMimeType(value.type)
                        },
                    ),
            )
            .optional()
            .when([], {
                is: () => modalType.value === 'file' && !isFileUploadFromUrl.value,
                then: (schema) => schema.min(1, ERROR_MESSAGES.REQUIRED.FILE),
                otherwise: (schema) => schema.notRequired(),
            }),

        owner: yup.mixed().concat(formOwnerSchema),

        isPublic: yup.boolean().required().default(false),

        members: yup.array().of(formMemberSchema).optional().default([]),
    })
}

const { handleSubmit, resetForm, setErrors, setFieldValue, values, errors } = useForm({
    validationSchema: toTypedSchema(getFormSchema(user, isFileUploadFromUrl)),
    validateOnMount: false,
    initialValues: {
        isPublic: false,
    },
})

// onMounted(() => {
//     setDefaultValue()
// })

watch(showFormModal, (val) => {
    if (val) {
        setDefaultValue()
    }
})

const setDefaultValue = () => {
    setFieldValue('owner.id', getUser.value?.id)
    if (modalType.value === 'folder') {
        setFieldValue('isPublic', true)
    } else {
        setFieldValue('isPublic', rowSelected.value ? rowSelected.value.isPublic : false)
    }
    setFieldValue('parentKey', rowSelected.value?.keyValue)
    if (modeType.value === 'edit') {
        setFieldValue('keyValue', rowSelected.value?.keyValue)
        setFieldValue('name', rowSelected.value?.name)
        setFieldValue('description', rowSelected.value?.description)
        setFieldValue('members', rowSelected.value?.members)
        selectedMembers.value = rowSelected.value?.members || []
    }
}

const onSetMemberValue = (member: FolderUserProps) => {
    selectedMember.value = member
}

const handleSubmitMember = (callback: () => void) => {
    if (!selectedMember.value) return
    const index = selectedMembers.value.findIndex((item) => item.id === selectedMember.value?.id)
    if (index > -1) return
    selectedMembers.value.push(selectedMember.value)
    callback()
}

const onSubmitMember = () => {
    setFieldValue(
        'members',
        selectedMembers.value.map((item) => {
            return {
                id: item.id,
            }
        }),
    )
}

const onRemoveMember = (id: string) => {
    const index = selectedMembers.value.findIndex((item) => item.id === id)
    if (index > -1) {
        selectedMembers.value.splice(index, 1)
    }
    onSubmitMember()
}

const onSubmit = handleSubmit((values) => {
    handleSubmitForm(values)
})

const handleSubmitForm = (values: any) => {
    if (modeType.value === 'create') {
        onCreateItem(values, modalType.value)
        onClose(false)
        return
    }
    if (modeType.value === 'edit') {
        onEditItem(values, modalType.value)
        onClose(false)
        return
    }
}

const onClose = (value: boolean) => {
    isFileUploadFromUrl.value = true
    resetForm()
    setErrors({})
    selectedMember.value = null
    selectedMembers.value = []
    onCloseFormModal(value)
}
</script>

<template>
    <Sheet :open="showFormModal" @update:open="onClose">
        <SheetContent>
            <SheetHeader>
                <SheetTitle>{{ modalTitle }}</SheetTitle>
            </SheetHeader>
            <SheetMain>
                <form autocomplete="off" class="grid gap-6" @submit="onSubmit">
                    <FormField v-slot="{ componentField }" name="name">
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text" v-bind="componentField" autocomplete="off" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="description">
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea v-bind="componentField" autocomplete="off" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <template v-if="showUploadFile">
                        <div class="flex items-center space-x-2">
                            <Switch id="get-file-from-url" v-model="isFileUploadFromUrl" />
                            <Label for="get-file-from-url">Get file from url?</Label>
                        </div>
                        <FormField v-if="!isFileUploadFromUrl" v-slot="{ value }" name="file">
                            <FormItem>
                                <FormLabel>File</FormLabel>
                                <FormControl>
                                    <file-pond
                                        name="test"
                                        ref="pond"
                                        class="my-pond"
                                        label-idle="Drop files here..."
                                        :accepted-file-types="ACCEPTED_MIME_TYPES"
                                        :files="value"
                                        @updatefiles="handleUpdateFile"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-else v-slot="{ componentField }" name="fileUrl">
                            <FormItem>
                                <FormLabel>File url</FormLabel>
                                <FormControl>
                                    <Input v-bind="componentField" autocomplete="off" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </template>

                    <div v-if="getUser" class="space-y-2">
                        <Label>Owner</Label>
                        <div class="border rounded-md p-3 space-y-2">
                            <ManualFormField>
                                <ManualFormLabel>Name</ManualFormLabel>
                                <p class="text-sm">{{ getUser.name }}</p>
                            </ManualFormField>
                            <ManualFormField>
                                <ManualFormLabel>Email</ManualFormLabel>
                                <p class="text-sm">{{ getUser.email }}</p>
                            </ManualFormField>
                        </div>
                    </div>

                    <FormField
                        v-if="modalType === 'file' && assignMembersToFileOnly"
                        v-slot="{ value, setValue }"
                        name="isPublic"
                    >
                        <FormItem class="flex items-center gap-2 space-y-0">
                            <FormControl>
                                <Switch
                                    type="button"
                                    :model-value="value"
                                    @update:model-value="setValue"
                                />
                            </FormControl>
                            <FormLabel>Public</FormLabel>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <div v-if="!values.isPublic" class="space-y-2">
                        <Label>Members</Label>
                        <div class="border rounded-md p-3">
                            <div class="flex items-start gap-2">
                                <FormField name="members">
                                    <FormItem class="flex-1">
                                        <FormControl>
                                            <Combobox class="w-full">
                                                <ComboboxAnchor
                                                    ref="comboboxMembers"
                                                    class="w-full"
                                                >
                                                    <div class="relative w-full items-center">
                                                        <ComboboxInput
                                                            :display-value="
                                                                (val) => val?.name ?? ''
                                                            "
                                                            placeholder="Select member..."
                                                        />
                                                        <ComboboxTrigger
                                                            class="absolute end-0 inset-y-0 flex items-center justify-center px-3"
                                                        >
                                                            <ChevronsUpDown
                                                                class="size-4 text-muted-foreground"
                                                            />
                                                        </ComboboxTrigger>
                                                    </div>
                                                </ComboboxAnchor>

                                                <ComboboxList>
                                                    <ComboboxEmpty> Nothing found. </ComboboxEmpty>

                                                    <ComboboxGroup>
                                                        <template v-for="member in members">
                                                            <ComboboxItem
                                                                v-if="member.id !== user?.id"
                                                                :key="member.id"
                                                                :value="member"
                                                                @select="onSetMemberValue(member)"
                                                            >
                                                                <div class="flex flex-col">
                                                                    <span class="text-sm">{{
                                                                        member.name
                                                                    }}</span>
                                                                    <span class="text-xs">{{
                                                                        member.email
                                                                    }}</span>
                                                                </div>

                                                                <ComboboxItemIndicator>
                                                                    <Check
                                                                        :class="
                                                                            cn('ml-auto h-4 w-4')
                                                                        "
                                                                    />
                                                                </ComboboxItemIndicator>
                                                            </ComboboxItem>
                                                        </template>
                                                    </ComboboxGroup>
                                                </ComboboxList>
                                            </Combobox>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                                <Button
                                    type="button"
                                    size="icon"
                                    @click="handleSubmitMember(onSubmitMember)"
                                >
                                    <Plus />
                                </Button>
                            </div>
                            <div v-if="selectedMembers.length > 0" class="mt-3 space-y-2">
                                <div
                                    v-for="item in selectedMembers"
                                    :key="item.id"
                                    class="flex flex-row gap-2"
                                >
                                    <div class="flex flex-col flex-1">
                                        <span class="text-sm">{{ item.name }}</span>
                                        <span class="text-xs">{{ item.email }}</span>
                                    </div>
                                    <div>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            severity="destructive"
                                            @click="onRemoveMember(item.id)"
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <input type="submit" class="hidden" />
                </form>
            </SheetMain>
            <SheetFooter>
                <SheetClose as-child>
                    <Button variant="ghost" severity="secondary">Cancel</Button>
                </SheetClose>
                <Button @click="onSubmit">Save</Button>
            </SheetFooter>
        </SheetContent>
    </Sheet>
</template>
