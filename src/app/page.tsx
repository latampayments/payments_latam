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
    <>
      <div className="flex w-full flex-wrap justify-around space-x-4 items-start">
        {countries.map((ct) => 
        <Link key={ct.id} href={`/country/${ct.id}`} >
          <Card className='flex flex-col bg-[#F6F6F6] mt-4'>
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
    </>
  )
}
