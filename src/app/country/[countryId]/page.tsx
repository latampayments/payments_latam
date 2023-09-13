import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import Image from 'next/image';
import { getBanks } from '@/lib/api';
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Params = {
  params: {
      countryId: string
  }
}

export default async function Country({ params: { countryId } }: Params) {
  const session = await getServerSession(authOptions);
  let fetchedBanks = await getBanks();
  const banksFetched = await Promise.all(fetchedBanks);
  let banks = banksFetched.filter(dt => dt.countryId === countryId);

  if (!session) {
    return redirect('/sign-in');
  }
    
  return (
      <div className="flex w-full flex-wrap justify-around items-start">
        {banks.map((ct, index) => 
        <Link key={index} href={`/bank/${ct.id}`} className=''>
        <Card className='flex flex-col bg-[#126E82] m-4 p-4 text-center w-64 h-80 text-white'>
            <CardHeader>
            <CardTitle>{ct.name}</CardTitle>
            </CardHeader>
            <CardContent>
            <Image
                className="rounded-sm object-fit object-center"
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
        )}
      </div>
    )
}
