import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
  const session = await auth()
      console.log('session',session)
          if(!session) redirect('/')
  return (
    <div>Welcome to vendor portal</div>
  )
}

export default page