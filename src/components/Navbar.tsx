import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { HandMetal, ShoppingCart, Home } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserLogout from "./ui/UserLogout";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <div className='bg-[#F6F6F6] py-2 border-b border-s-zinc-200 w-full'>
        <div className='flex items-center justify-around my-4'>
          <Link href='/'>
          <Home />
          </Link>
          {session ? (
            <UserLogout />
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
