"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const trendingData = {
  industries: [
    { name: "Healthcare", count: 1234, percentage: 85 },
    { name: "Finance", count: 987, percentage: 75 },
    { name: "Education", count: 876, percentage: 65 },
    { name: "Manufacturing", count: 765, percentage: 55 },
    { name: "Retail", count: 654, percentage: 45 },
  ],
  businessNeeds: [
    { name: "Customer Management", count: 2345, percentage: 90 },
    { name: "Data Analytics", count: 1987, percentage: 80 },
    { name: "Project Management", count: 1876, percentage: 70 },
    { name: "Inventory Control", count: 1765, percentage: 60 },
    { name: "HR Management", count: 1654, percentage: 50 },
  ],
  softwares: [
    { name: "Software A", views: 3456, percentage: 95 },
    { name: "Software B", views: 2987, percentage: 85 },
    { name: "Software C", views: 2876, percentage: 75 },
    { name: "Software D", views: 2765, percentage: 65 },
    { name: "Software E", views: 2654, percentage: 55 },
  ],
  features: [
    { name: "Real-time Analytics", count: 4567, percentage: 92 },
    { name: "Cloud Storage", count: 3987, percentage: 82 },
    { name: "Mobile App", count: 3876, percentage: 72 },
    { name: "API Integration", count: 3765, percentage: 62 },
    { name: "Automated Reports", count: 3654, percentage: 52 },
  ],
  painPoints: [
    { name: "Data Security", count: 5678, percentage: 88 },
    { name: "System Integration", count: 4987, percentage: 78 },
    { name: "Cost Management", count: 4876, percentage: 68 },
    { name: "User Training", count: 4765, percentage: 58 },
    { name: "Scalability", count: 4654, percentage: 48 },
  ],
}

export function TrendingData() {
  return (
    <Tabs defaultValue="industries" className="space-y-4">
      <div className="flex justify-between items-center px-4 lg:px-6">
        <TabsList>
          <TabsTrigger value="industries">Industries</TabsTrigger>
          <TabsTrigger value="businessNeeds">Business Needs</TabsTrigger>
          <TabsTrigger value="softwares">Software</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="painPoints">Pain Points</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="industries" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Trending Industries</CardTitle>
            <CardDescription>Top 5 industries searched for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingData.industries.map((industry) => (
                <div key={industry.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{industry.name}</span>
                    <span className="text-muted-foreground">{industry.count}</span>
                  </div>
                  <Progress value={industry.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="businessNeeds" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Trending Business Needs</CardTitle>
            <CardDescription>Top 5 business needs from quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingData.businessNeeds.map((need) => (
                <div key={need.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{need.name}</span>
                    <span className="text-muted-foreground">{need.count}</span>
                  </div>
                  <Progress value={need.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="softwares" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Trending Software</CardTitle>
            <CardDescription>Top 5 most viewed software</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingData.softwares.map((software) => (
                <div key={software.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{software.name}</span>
                    <span className="text-muted-foreground">{software.views}</span>
                  </div>
                  <Progress value={software.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="features" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Trending Features</CardTitle>
            <CardDescription>Most selected features in trending needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingData.features.map((feature) => (
                <div key={feature.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{feature.name}</span>
                    <span className="text-muted-foreground">{feature.count}</span>
                  </div>
                  <Progress value={feature.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="painPoints" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Trending Pain Points</CardTitle>
            <CardDescription>Most selected pain points in trending needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingData.painPoints.map((point) => (
                <div key={point.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{point.name}</span>
                    <span className="text-muted-foreground">{point.count}</span>
                  </div>
                  <Progress value={point.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 