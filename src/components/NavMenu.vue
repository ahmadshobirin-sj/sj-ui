<script setup lang="ts">
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import type { NavGroup } from '@/types'
import { ChevronDown } from 'lucide-vue-next'
import { type HTMLAttributes } from 'vue'

const props = defineProps<{
    items: NavGroup[]
    class?: HTMLAttributes['class']
}>()

const currentUrl = ''
</script>

<template>
    <SidebarGroup
        v-for="(group, index) in items"
        :key="index"
        :class="cn('px-2 py-0', props.class)"
    >
        <SidebarGroupLabel>{{ group.title }}</SidebarGroupLabel>
        <SidebarMenu>
            <template v-for="item in group.items" :key="item.title">
                <Collapsible
                    v-if="item.items && item.items?.length > 0"
                    defaultOpen
                    class="group/collapsible"
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger as-child>
                            <SidebarMenuButton :tooltip="item.title">
                                <component :is="item.icon" />
                                <span>{{ item.title }}</span>
                                <ChevronDown
                                    class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                                />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem
                                    v-for="(subItem, subIndex) in item.items"
                                    :key="subIndex"
                                >
                                    <SidebarMenuSubButton
                                        as-child
                                        :is-active="subItem.href === currentUrl"
                                        :tooltip="subItem.title"
                                    >
                                        <a :href="subItem.href">
                                            <component :is="subItem.icon" />
                                            <span>{{ subItem.title }}</span>
                                        </a>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
                <SidebarMenuItem v-else>
                    <SidebarMenuButton
                        as-child
                        :is-active="item.href === currentUrl"
                        :tooltip="item.title"
                    >
                        <a :href="item.href">
                            <component :is="item.icon" />
                            <span>{{ item.title }}</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </template>
        </SidebarMenu>
    </SidebarGroup>
</template>
