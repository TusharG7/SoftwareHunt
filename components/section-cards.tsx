"use client"

import { IconTrendingDown, IconTrendingUp, IconCalendar } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const timePeriods = [
  { value: "yesterday", label: "Yesterday" },
  { value: "week", label: "Last Week" },
  { value: "month", label: "Last Month" },
  { value: "quarter", label: "Last Quarter" },
  { value: "year", label: "Last Year" },
  // { value: "custom", label: "Custom" },
]

// Mock data for different time periods
const timeBasedData = {
  yesterday: {
    activeSoftware: { value: 123, change: 2.3 },
    visitors: { value: 456, change: 1.2 },
    comparisons: { value: 234, change: 3.4 },
    formFills: { value: 45, change: 0.8 },
  },
  week: {
    activeSoftware: { value: 789, change: 5.6 },
    visitors: { value: 2345, change: 4.3 },
    comparisons: { value: 1234, change: 6.7 },
    formFills: { value: 345, change: 2.1 },
  },
  month: {
    activeSoftware: { value: 1234, change: 15.3 },
    visitors: { value: 45678, change: 8.2 },
    comparisons: { value: 12345, change: 12.5 },
    formFills: { value: 3456, change: 5.7 },
  },
  quarter: {
    activeSoftware: { value: 3456, change: 25.4 },
    visitors: { value: 123456, change: 18.9 },
    comparisons: { value: 34567, change: 22.3 },
    formFills: { value: 9876, change: 15.6 },
  },
  year: {
    activeSoftware: { value: 9876, change: 45.6 },
    visitors: { value: 456789, change: 38.7 },
    comparisons: { value: 98765, change: 42.3 },
    formFills: { value: 23456, change: 35.8 },
  },
  // custom: {
  //   activeSoftware: { value: 5678, change: 18.9 },
  //   visitors: { value: 234567, change: 15.4 },
  //   comparisons: { value: 45678, change: 20.1 },
  //   formFills: { value: 12345, change: 12.3 },
  // },
}

export function SectionCards() {
  const [timeRange, setTimeRange] = useState("month")

  const currentData = timeBasedData[timeRange as keyof typeof timeBasedData]

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end px-4 lg:px-6">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <IconCalendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {timePeriods.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 lg:px-6 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        <Card className="@container/card group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              Active Software Listed
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl group-hover:text-primary transition-colors">
              {formatNumber(currentData.activeSoftware.value)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                <IconTrendingUp className="mr-1 h-4 w-4" />
                +{currentData.activeSoftware.change}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {timePeriods.find(p => p.value === timeRange)?.label} <IconTrendingUp className="size-4 text-green-500" />
            </div>
            <div className="text-muted-foreground">
              Total active software listings
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              Total Website Visitors
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl group-hover:text-primary transition-colors">
              {formatNumber(currentData.visitors.value)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                <IconTrendingUp className="mr-1 h-4 w-4" />
                +{currentData.visitors.change}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {timePeriods.find(p => p.value === timeRange)?.label} <IconTrendingUp className="size-4 text-blue-500" />
            </div>
            <div className="text-muted-foreground">
              Total website visitors
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" />
              Total Comparisons
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl group-hover:text-primary transition-colors">
              {formatNumber(currentData.comparisons.value)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                <IconTrendingUp className="mr-1 h-4 w-4" />
                +{currentData.comparisons.change}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {timePeriods.find(p => p.value === timeRange)?.label} <IconTrendingUp className="size-4 text-purple-500" />
            </div>
            <div className="text-muted-foreground">
              Total comparison page visits
            </div>
          </CardFooter>
        </Card>

        <Card className="@container/card group hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" />
              Total Form Fills
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl group-hover:text-primary transition-colors">
              {formatNumber(currentData.formFills.value)}
            </CardTitle>
            <CardAction>
              <Badge variant="outline" className="bg-orange-500/10 text-orange-500">
                <IconTrendingUp className="mr-1 h-4 w-4" />
                +{currentData.formFills.change}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {timePeriods.find(p => p.value === timeRange)?.label} <IconTrendingUp className="size-4 text-orange-500" />
            </div>
            <div className="text-muted-foreground">
              Total form submissions
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
