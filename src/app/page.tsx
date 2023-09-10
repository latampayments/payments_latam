import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image';
import { getCountries } from '@/lib/api';

export default async function Home() {
  let {countries} = await getCountries();

  return (
    <div className="flex py-2">
      <div className="w-full flex flex-wrap justify-around space-x-2 space-y-2 items-center lg:justify-between sm:justify-center md:justify-center">
        {countries.map((ct) => 
        <Link key={ct.id} href={`/country/${ct.id}`} className='justify-center text-center'>
          <Card className=' py-2 bg-[#F6F6F6]'>
            <CardHeader>
              <CardTitle>{ct.country}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                  className="rounded-sm h-48 w-48 object-cover object-center"
                  src={ct.flag}
                  alt={ct.country}
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
