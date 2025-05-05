// app/(private)/admin/softwares/page.tsx
import ClientWrapper from '@/components/admin/softwares/ClientWrapper'
import { getAllSoftware } from '@/services/software.service'
import React from 'react'

const page = async () => {
  const itemsPerPage = 10;
  const { softwares, totalCount, page } = await getAllSoftware({
    page: 1,
    itemsPerPage,
  });

  return (
    <div>
      <ClientWrapper 
        initialSoftwares={softwares} 
        totalCount={totalCount} 
        currentPage={page} 
        itemsPerPage={itemsPerPage} 
      />
    </div>
  )
}

export default page