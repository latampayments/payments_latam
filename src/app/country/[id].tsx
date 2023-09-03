import prisma from '@/lib/db';
import { GetStaticProps } from 'next/types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';


interface Bank {
  id: string;
  name: string;
  logo: string;
  countryId: string;

}
const Bank = (props: { banks: Bank[], 
  hasError: boolean }) => {
    console.log('bank')
    console.log(props)
    let router = useRouter();
    console.log(router)

    if (props.hasError) {
      return <h1>Error - please try another Country</h1>
    }
  
  return (
    <div className="static mt-[400px] flex justify-center p-2">
      <div className="w-full flex flex-wrap right-0 justify-around space-x-2 space-y-2 items-center lg:justify-between sm:justify-center md:justify-center">
        {props.banks.map((ct) => 
        <Link key={ct.id} href={`/payment/${ct.id}`} className='justify-center text-center'>
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

export default Bank

export const getStaticProps: GetStaticProps = async (context) => {
  console.log(context)
  const data = await getBanks();
  const countryID = context.params?.id as string;
  let banks = data.filter(dt => dt.countryId === countryID);
  if (!banks) {
    return {
      props: { hasError: true },
    }
  }

  return {
    props: {
      banks
    }
  }
}
export const getBanks = async() => {
  const banks: Bank[] = await prisma.bank.findMany({
    select: {
      id: true,
      name: true,
      logo: true,
      countryId: true
    }
  });
  return banks
};