import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"

import data from "@/app/(private)/data.json"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function page() {
  const session = await auth()
      console.log('session',session)
          if(!session) redirect('/')
  return (
    <>
    <div className="flex flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
    </>
  )
}
