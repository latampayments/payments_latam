import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from './ui/button';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DropDownMenuForm from '@/components/form/DropDownMenuForm';
import * as React from 'react';

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className='bg-[#F6F6F6] py-2 border-b border-s-zinc-200 w-full'>
        <div className='flex items-center justify-around my-4'>
          <Link href='/'>
            <Image src='/logo.png' alt='Latam Payments' width={300} height={100} className='rounded bg-inherit' />
          </Link>
          <div>
          </div>
          {session ? (
            <DropDownMenuForm />
          ) :
          <Link className={buttonVariants()} href='/sign-in'>
            Sign in
          </Link>
          }
        </div>
      </div>
    </>
  );
};

export default Navbar;
