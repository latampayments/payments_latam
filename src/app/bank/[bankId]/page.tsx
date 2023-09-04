import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import Image from 'next/image';
import { getMethods } from '@/lib/api';

type Params = {
  params: {
      bankId: string
  }
}
export default async function Bank({ params: { bankId } }: Params) {
  let fetchedMethods = await getMethods();
  const methodsFetched = await Promise.all(fetchedMethods);
  let methods = methodsFetched.filter(dt => dt.bankId === bankId);
    
  return (
    <div className="static flex justify-center">
      <div className="w-full flex flex-wrap right-0 justify-around space-x-4 space-y-4 items-center lg:justify-between sm:justify-center md:justify-center">
        {methods.map((ct) => 
        <Link key={ct.id} href={`/method/${ct.id}`} className='justify-center text-center'>
        <Card className='bg-slate-200 text-center flex w-96 flex-col'>
            <CardHeader>
            <CardTitle>{ct.type}</CardTitle>
            <CardDescription>Limite {ct.limits}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <p className=''>{ct.information}</p>
              <Image
                  className="rounded-sm h-48 w-48 object-cover object-center"
                  src={ct?.symbol}
                  alt={ct.type}
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
