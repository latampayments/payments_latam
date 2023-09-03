import { buttonVariants } from '@/components/ui/button'
import prisma from '@/lib/db';
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GetServerSideProps, NextPage } from "next";
import Image from 'next/image';

interface Country {
  id: string;
  country: string;
  flag: string;
}

interface CountryProps {
  countries: Country[];
}

export default async function Home() {
  let {countries} = await getCountries();
  return (
    <div className="static mt-10 justify-center p-2">
      <div className="w-full flex flex-wrap right-0 justify-around space-x-2 space-y-2 items-center lg:justify-between sm:justify-center md:justify-center">
        {countries.map((ct) => 
        <Link key={ct.id} href={`/country/${ct.id}`} className='justify-center text-center'>
          <Card>
            <CardHeader>
              <CardTitle>{ct.country}</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                  className="rounded-sm h-48 w-48 object-cover object-center"
                  src={ct.flag}
                  alt={ct.country}
                  width={400}
                  height={300}
                />
            </CardContent>
          </Card>
        </Link>
        )}
      </div>
    </div>
  )
}

export const getCountries = async() => {
  const countries: Country[] = await prisma.country.findMany({
    select: {
      id: true,
      country: true,
      flag: true,
    }
  });
  return { countries }
}