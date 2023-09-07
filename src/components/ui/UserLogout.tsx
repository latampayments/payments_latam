'use client';
import { signOut } from 'next-auth/react';
import { Button, buttonVariants } from './button';

export default function UserLogout() {
    return(
        <Button onClick={() => signOut({
            redirect: true,
            callbackUrl: `${window.location.origin}`
        })} variant='outline'>Sign Out</Button>
    )    
}