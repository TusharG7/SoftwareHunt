'use client'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import IndustriesDropdown from './IndustriesDropdown'

const Nav = () => {
  return (
    <div className="lg:px-20 xl:px-36">
    <div className='grid grid-cols-3 items-center  font-sans h-[63px] bg-[#F3F4F5] border-[#0a18371a] border-1 my-[11px] px-2.5 rounded-full'>
        <div className='col-span-1 flex items-center pl-4'>
            <Link href={'/'}>
            <Image src='/logo.svg' alt='logo' width={218} height={20} />
            </Link>
        </div>
        <div className='col-span-1 flex justify-center items-center text-[#0A1837]'>
            <IndustriesDropdown />
            <Link href={'/about-us'} className='mx-2 opacity-[68%]'>About Us</Link>
            <Link href={'/partners'} className='mx-2 opacity-[68%]'>For Partners</Link>
        </div>
        <div className="col-span-1 flex justify-end gpa-2">
            <Link href={'/contact-us'} className='bg-indigo text-white w-[115px] h-[46px] text-center flex items-center justify-center rounded-full'>Contact Us</Link>
        </div>
    </div>
    </div>
  )
}

export default Nav