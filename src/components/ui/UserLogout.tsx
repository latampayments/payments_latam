'use client';
import { signOut } from 'next-auth/react';
import { Button, buttonVariants } from './button';

export default function UserLogout() {
    return(
        <Button onClick={() => signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}`
        })} variant='outline' className='px-2 flex justify-center w-full'>Sign Out</Button>
    )    
}