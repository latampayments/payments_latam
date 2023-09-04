import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import Image from 'next/image';
import { getBanks } from '@/lib/api';

type Params = {
  params: {
      countryId: string
  }
}

export default async function Country({ params: { countryId } }: Params) {
  let fetchedBanks = await getBanks();
  const banksFetched = await Promise.all(fetchedBanks);
  let banks = banksFetched.filter(dt => dt.countryId === countryId);
    
  return (
    <div className="static flex justify-center -mt-[200px]">
      <div className="w-full flex flex-wrap right-0 justify-around space-x-4 space-y-4 items-center lg:justify-between sm:justify-center md:justify-center">
        {banks.map((ct) => 
        <Link key={ct.id} href={`/bank/${ct.id}`} className='justify-center text-center'>
        <Card className='bg-slate-200'>
            <CardHeader>
            <CardTitle>{ct.name}</CardTitle>
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
        )}
    </div>
    </div>
    
    )
}
