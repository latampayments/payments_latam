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
import { getBankById } from '@/lib/api';
import { getServerSession } from "next-auth";
  
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
            <div className="flex w-full flex-wrap justify-around items-start">
                {data ? data.map((ct: any) => 
                <Link key={ct.id} href={`/bank/${ct.id}`} className=''>
                <Card className='flex flex-col bg-[#126E82] m-4 p-4 text-center'>
                    <CardHeader>
                    <CardTitle className='text-sm'>{ct.country.country}{` > `}{ct.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <Image
                        className="rounded-sm h-48 w-48 object-cover object-center"
                        src={ct.logo}
                        alt={ct.name}
                        width={400}
                        height={400}
                        security='https'
                        placeholder="blur"
                        blurDataURL={ct.logo}
                    />
                    </CardContent>
                </Card>
                </Link>
                ) : 
                <button type="button" className="bg-indigo-500 ..." disabled>
                    <svg className="motion-reduce:hidden animate-spin ..." viewBox="0 0 24 24"></svg>
                    Processing...
                </button>
                }
            </div>
        </>
    )
}

export default SearchPage;