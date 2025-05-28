'use client'
import * as React from "react"
import Link from "next/link"
import { getIndustryOptions } from '@/services/industries.service'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { FactoryIcon } from "lucide-react"

interface Industry {
  industryId: string
  name: string
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
            
          <div className="flex items-center text-sm font-medium leading-none"><FactoryIcon size={25} color="black" className="mr-2"/> {title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default function IndustriesDropdown() {
  const [industries, setIndustries] = React.useState<Industry[]>([])

  React.useEffect(() => {
    async function loadIndustries() {
      try {
        const options = await getIndustryOptions()
        setIndustries(options)
      } catch (error) {
        console.error('Error loading industries:', error)
      }
    }
    loadIndustries()
  }, [])

  // Split industries into two columns
  const midPoint = Math.ceil(industries.length / 2)
  const leftColumn = industries.slice(0, midPoint)
  const rightColumn = industries.slice(midPoint)

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Industries</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="z-30 grid gap-3 p-4 w-[500px] md:grid-cols-2">
              {leftColumn.map((industry) => (
                <ListItem
                  key={industry.industryId}
                  title={industry.name}
                  href={`/industries/${industry.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  Browse software for {industry.name} industry
                </ListItem>
              ))}
              {rightColumn.map((industry) => (
                <ListItem
                  key={industry.industryId}
                  title={industry.name}
                  href={`/industries/${industry.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  Browse software for {industry.name} industry
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}