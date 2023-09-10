'use client'
 
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { FormItem } from '@/components/ui/form';

export const dynamic = 'force-dynamic'
export default function SearchBar() {
    const search = useSearchParams();
    const [searchQuery, setSearchQuery] = useState<string | null>(
        search ? search.get("q") : ""
    );
    const router = useRouter();

    const onSearch = (event: React.FormEvent) => {
        event.preventDefault();

        if (typeof searchQuery !== "string") {
        return;
        }

        const encodedSearchQuery = encodeURI(searchQuery);
        router.push(`/search/${encodedSearchQuery}`);
    };

    
    
    return (
        <div>
            <form method="GET" className="flex justify-center w-2/3" onSubmit={onSearch}>
                <Input value={searchQuery || ""} onChange={(e) => setSearchQuery(e.target.value)} className='px-5 py-1 w-2/3 sm:px-5 sm:py-3 flex-1 text-slate-900' placeholder='Search for a Bank' />

            </form>
        </div> 
    )
}