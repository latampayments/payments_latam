import { Bank } from '@prisma/client';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import Image from 'next/image';
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useSession } from 'next-auth/react';
import { getBankById } from '@/lib/api';
import { getServerSession } from "next-auth";
  
const FetchQuery = async(url: string) => {
    let response = await fetch(url) //fetchDataByQuery(url)
    let banks = await response.json();
    let countryId = banks[0].countryId;
    let countryName = await getBankById(countryId);
    
    if(!response.ok) {
        throw new Error(`${response.statusText}: Failed to fetch your search.`)
    }
    return response.json()
};
type Params = {
    params: {
        bank: string
    }
  }

const SearchPage = async({ params: { bank } }: Params) => {
    const session = await getServerSession(authOptions);
    let bankName = bank;
    const {data }: any = await getBankById(bankName);
    
    if (!session) {
        return redirect('/sign-in');
    }

    if(!data) {
        return null;
    };

    return (
        <>
            <span className="text-xl">
            Showing results for:{" "}
            <span className="font-semibold">{bankName}</span>
            </span>
            <div className="w-full flex flex-wrap justify-center space-x-4 space-y-4 items-center text-black">
                {data ? data.map((ct: any) => 
                <Link key={ct.id} href={`/bank/${ct.id}`} className=''>
                <Card className='bg-[#F6F6F6] flex flex-col text-center'>
                    <CardHeader>
                    <CardTitle>{ct.country.country} {ct.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Image
                        className="rounded-sm h-48 w-48 object-cover object-center"
                        src={ct.logo}
                        alt={ct.name}
                        width={400}
                        height={400}
                    />
                    </CardContent>
                </Card>
                </Link>
                ) : 
                <h1>No results</h1>}
            </div>
        </>
    )
}

export default SearchPage;