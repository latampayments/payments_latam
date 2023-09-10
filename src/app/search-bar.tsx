'use client'
 
import { useRouter } from 'next/navigation'
import { useState } from 'react';
import { Input } from '@/components/ui/input';

// export const dynamic = 'force-dynamic'
export default function SearchBar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
 

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault;
        const encodeSearchURL = encodeURI(searchQuery);
        router.push(`/search?q=${encodeSearchURL}`);
    }
 
    return (
        <div>
            <form className="flex justify-center w-2/3" onSubmit={onSearch}>
                <Input name="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-slate-900' placeholder='Search for a Bank' />
            </form>
        </div> 
    )
}