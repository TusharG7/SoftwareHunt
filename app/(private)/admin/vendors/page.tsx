import { auth } from '@/auth';
import ClientWrapper from '@/components/admin/vendors/ClientWrapper'
import { getAllVendors } from '@/services/vendors.service'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const session = await auth()
      console.log('session',session)
          if(!session) redirect('/')
    const itemsPerPage = 10;
    const {vendors, totalcount, page} = await getAllVendors({
        page: 1,
        itemsPerPage: itemsPerPage,
      });
      console.log('vendors - ',vendors);
      console.log('itemsPerPage - ',itemsPerPage);
      console.log('totalcount - ',totalcount);
      console.log('page - ',page);

  return (
    <div>
      <ClientWrapper vendors={vendors} itemsPerPage={itemsPerPage} totalcount={totalcount} page={page} /> {/* Pass data as a prop */}
    </div>
  );
};

export default page;