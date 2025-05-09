"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IconLogout } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";

export function SiteHeader() {
  const { data: session } = useSession();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{session?.user?.role} PANEL</h1>
        <div className="ml-auto flex items-center gap-2 py-2">
          <Button
            variant="ghost"
            size="lg"
            title="Sign Out"
            className="flex hover:cursor-pointer"
            onClick={async (e) => {
              e.preventDefault();
              console.log('signing out')
              await signOut();
            }}
          >
            <IconLogout size={25} /> Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
