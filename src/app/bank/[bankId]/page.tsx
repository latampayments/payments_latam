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
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

type Params = {
  params: {
      bankId: string
  }
}
export default async function Bank({ params: { bankId } }: Params) {
  const session = await getServerSession(authOptions);
  let fetchedMethods = await getMethods();
  const methodsFetched = await Promise.all(fetchedMethods);
  let methods = methodsFetched.filter(dt => dt.bankId === bankId);
  
  if (!session) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex justify-center">
      <div className="w-full flex flex-wrap space-x-4 space-y-4 lg:justify-between sm:justify-center md:justify-center">
        {methods.map((ct) => 
        <Link key={ct.id} href={`/method/${ct.id}`}>
        <Card className='bg-[#F6F6F6] justify-center items-center px-1'>
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
