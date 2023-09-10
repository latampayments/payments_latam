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
      <div className="w-full flex flex-wrap justify-around space-x-4 space-y-4 items-center">
        {banks.map((ct) => 
        <Link key={ct.id} href={`/bank/${ct.id}`} className=''>
        <Card className='bg-[#F6F6F6] flex flex-col text-center'>
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
    )
}
