"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function ComponentsPage() {
  return (
    <div className="p-8 mx-auto max-w-6xl">
      {/* Header */}
      <h1 className="text-3xl font-bold text-fg-base mb-6">Design Components Showcase</h1>

      {/* Tree Structure for Themes */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-fg-muted mb-4">Theme's Overview</h2>
        <div className="grid grid-cols-3 gap-4">
          {/* Theme 1 */}
          <div className="p-4 border border-border-subtle rounded-lg">
            <h3 className="text-lg font-semibold text-fg-base">Theme 1</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="w-16 h-16 bg-indigo"></div>
              <div className="w-16 h-16 bg-magenta"></div>
              <div className="w-16 h-16 bg-black"></div>
              <div className="w-16 h-16 bg-platinum"></div>
            </div>
          </div>

          {/* Theme 2 */}
          <div className="p-4 border border-subtle rounded-lg">
            <h3 className="text-lg font-semibold text-fg-base">Theme 2</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="w-16 h-16 bg-oxford-blue"></div>
              <div className="w-16 h-16 bg-orange"></div>
              <div className="w-16 h-16 bg-night-black"></div>
              <div className="w-16 h-16 bg-platinum"></div>
            </div>
          </div>

          {/* Theme 3 */}
          <div className="p-4 border border-border-subtle rounded-lg">
            <h3 className="text-lg font-semibold text-fg-base">Theme 3</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="w-16 h-16 bg-indigo-dye"></div>
              <div className="w-16 h-16 bg-maya-blue"></div>
              <div className="w-16 h-16 bg-burnt-sienna"></div>
              <div className="w-16 h-16 bg-gunmetal"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ShadCN Components */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-fg-muted">ShadCN UI Components</h2>

        {/* Buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Buttons</h3>
          <div className="space-x-2">
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        {/* Inputs */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Input Fields</h3>
          <Input placeholder="Enter text..." />
        </div>


    <div className="flex space-x-2">
        {/* Select Dropdown */}
        <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="aubergine">Aubergine</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="carrot" disabled>Carrot</SelectItem>
          <SelectItem value="leek">Leek</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Meat</SelectLabel>
          <SelectItem value="beef">Beef</SelectItem>
          <SelectItem value="chicken">Chicken</SelectItem>
          <SelectItem value="lamb">Lamb</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    {/* Dropdown Menu */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Dropdown</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile Item</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Github</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
        

        {/* Tabs */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tabs</h3>
          <Tabs>
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Tooltip */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Tooltip</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </div>

        {/* Checkbox */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Checkbox</h3>
          <Checkbox about="Check me" />
        </div>

        {/* Switch */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Switch</h3>
          <Switch />
        </div>

        {/* Progress */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Progress Bar</h3>
          <Progress value={50} />
        </div>

        {/* Slider */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Slider</h3>
          <Slider defaultValue={[30]} />
        </div>

        {/* Separator */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Separator</h3>
          <Separator />
        </div>

        {/* Skeleton */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Skeleton</h3>
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Badge */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Badge</h3>
          <Badge>Badge</Badge>
        </div>

        {/* Toggle */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Toggle</h3>
          <Toggle>Toggle</Toggle>
        </div>
      </section>
    </div>
  );
}
