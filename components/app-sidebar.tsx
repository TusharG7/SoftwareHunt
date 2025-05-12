"use client"

import * as React from "react"
import {
  IconApps,
  IconCamera,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

const data = {
  adminLinks: [
    // {
    //   title: "Dashboard",
    //   url: "/admin",
    //   icon: IconDashboard,
    // },
    {
      title: "Vendors",
      url: "/admin/vendors",
      icon: IconUsers,
    },
    {
      title: "Softwares",
      url: "/admin/softwares",
      icon: IconApps,
    },
    // {
    //   title: "Business Needs",
    //   url: "/admin/business-needs",
    //   icon: IconListDetails,
    // },
    // {
    //   title: "Industries",
    //   url: "/admin/industries",
    //   icon: IconChartBar,
    // },
  ],
  vendorLinks: [
    // {
    //   title: "Dashboard",
    //   url: "/admin",
    //   icon: IconDashboard,
    // },
    {
      title: "My profile",
      url: "/vendor/profile",
      icon: IconFolder,
    },
    {
      title: "My Softwares",
      url: "/vendor/softwares",
      icon: IconApps,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {data: session} = useSession()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/admin">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Software Hunt.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {session?.user?.role === "ADMIN" && (
        <NavMain items={data.adminLinks} />
        )}
        {session?.user?.role === "VENDOR" && (
          <NavMain items={data.vendorLinks} />
        )}
        {/* <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
