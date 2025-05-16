<script setup lang="ts">
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type AppDropdownMenuProps } from '.'
import { cn } from '@/lib/utils'

const props = defineProps<AppDropdownMenuProps>()
</script>

<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <slot />
        </DropdownMenuTrigger>
        <DropdownMenuContent :class="cn('w-56', props.classContent)">
            <template v-for="(item, i) in items" :key="i">
                <DropdownMenuLabel v-if="item.type === 'label'">{{ item.label }}</DropdownMenuLabel>

                <DropdownMenuSeparator v-else-if="item.type === 'separator'" />

                <DropdownMenuGroup v-else-if="item.type === 'group'">
                    <template v-for="(child, j) in item.children" :key="j">
                        <component
                            :is="DropdownMenuItem"
                            v-if="child.type === 'item'"
                            :disabled="child.disabled"
                            @click="child.onClick"
                        >
                            <component :is="child.icon" v-if="child.icon" class="mr-2 h-4 w-4" />
                            <span>{{ child.label }}</span>
                            <DropdownMenuShortcut v-if="child.shortcut">{{
                                child.shortcut
                            }}</DropdownMenuShortcut>
                        </component>
                    </template>
                </DropdownMenuGroup>

                <DropdownMenuSub v-else-if="item.type === 'sub'">
                    <DropdownMenuSubTrigger>
                        <component :is="item.icon" v-if="item.icon" class="mr-2 h-4 w-4" />
                        <span>{{ item.label }}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            <template v-for="(subItem, k) in item.children" :key="k">
                                <DropdownMenuItem
                                    v-if="subItem.type === 'item'"
                                    :disabled="subItem.disabled"
                                    as="button"
                                    @click="subItem.onClick"
                                >
                                    <component
                                        :is="subItem.icon"
                                        v-if="subItem.icon"
                                        class="mr-2 h-4 w-4"
                                    />
                                    <span>{{ subItem.label }}</span>
                                    <DropdownMenuShortcut v-if="subItem.shortcut">{{
                                        subItem.shortcut
                                    }}</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator v-else-if="subItem.type === 'separator'" />
                            </template>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>

                <DropdownMenuItem
                    v-else-if="item.type === 'item'"
                    :disabled="item.disabled"
                    @click="item.onClick"
                >
                    <component :is="item.icon" v-if="item.icon" class="mr-2 h-4 w-4" />
                    <span>{{ item.label }}</span>
                    <DropdownMenuShortcut v-if="item.shortcut">{{
                        item.shortcut
                    }}</DropdownMenuShortcut>
                </DropdownMenuItem>
            </template>
        </DropdownMenuContent>
    </DropdownMenu>
</template>
