import Link from 'next/link';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import SearchBar from '@/app/search-bar';
import UserLogout from "../ui/UserLogout";
import { Button } from '../ui/button';

const DropDownMenuForm = () => {

    return(
        <DropdownMenu>
            <DropdownMenuTrigger className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'  aria-label='Menu'>Options</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel aria-label='Search'>Search:</DropdownMenuLabel>
                <SearchBar />
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <Link href='/limits' className='flex w-full' aria-label='Limits'>
                        <Button variant='outline' className=' justify-center w-full'>Limits</Button>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem><UserLogout /></DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default DropDownMenuForm;