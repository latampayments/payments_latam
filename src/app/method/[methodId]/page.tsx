
import Image from 'next/image';
import { getSteps } from '@/lib/api';
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


type Params = {
  params: {
    methodId: string
  }
}

export default async function Method({ params: { methodId } }: Params) {
  const session = await getServerSession(authOptions);
  let fetchedPmt = await getSteps();
  const pmtFetched = await Promise.all(fetchedPmt);
  let steps = pmtFetched.filter(dt => dt.paymentId === methodId);

  if (!session) {
    return redirect('/sign-in');
  }

  return (
    <div className="static flex justify-center ">
      <div className="w-full flex flex-wrap right-0 justify-around space-x-4 space-y-4 items-center lg:justify-between sm:justify-center md:justify-center">
      {steps.map((ct: any) => (
            <div key={ct.id} className="">
              <div className="flex flex-col justify-center items-center text-center">
              <Image
                  className="rounded-sm h-48 w-48 object-cover object-center"
                  src={ct.st1_pic}
                  alt=""
                  width={400}
                  height={400}
              />
              <div className="flex flex-col px-2">
                <h3 className="font-bold pl-2">{ct.st1_text}</h3>
              </div>
              <br />
              <Image
                  className="rounded-sm h-48 w-48 object-cover object-center"
                  src={ct.st2_pic}
                  alt=""
                  width={400}
                  height={400}
              />
              <div className="flex flex-col px-2">
                <h3 className="font-bold pl-2">{ct.st2_text}</h3>
              </div>
              <br />
              {/*<img
                className="rounded-sm object-cover object-center"
                src={ct.st3_pic}
                alt=""
              />
              <div className="flex flex-col px-2">
                <h3 className="font-bold pl-2">{ct.st3_text}</h3>
              </div>
              <br />
              <img
                className="rounded-sm object-cover object-center"
                src={ct.st4_pic}
                alt=""
              />
              <div className="flex flex-col px-2">
                <h3 className="font-bold pl-2">{ct.st4_text}</h3>
              </div>
              <br />
              <img
                className="rounded-sm object-cover object-center"
                src={ct.st5_pic}
                alt=""
              />
              <div className="flex flex-col px-2">
                <h3 className="font-bold pl-2">{ct.st5_text}</h3>
              </div>*/}
            </div>
          </div>
        ))}
    </div>
    </div>
    
    )
}
