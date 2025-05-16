<script setup lang="ts">
import NavUser from '@/components/NavUser.vue'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useMenu } from '@/composables/useMenu'
import AppLogo from './AppLogo.vue'
import NavMenu from './NavMenu.vue'

const { mainNavItems, footerNavItems } = useMenu()

</script>

<template>
    <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <a href="#">
                            <AppLogo />
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
            <NavMenu :items="mainNavItems" />
        </SidebarContent>

        <SidebarFooter class="px-0">
            <NavMenu :items="footerNavItems" />
        </SidebarFooter>
        <SidebarFooter>
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
