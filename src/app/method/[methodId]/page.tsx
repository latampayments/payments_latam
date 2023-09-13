
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
    <div className="flex flex-wrap w-full justify-center items-start">
      {steps.map((ct, index) => (
          <div key={index} className="mt-2">
            {ct.st1_pic && <div>
              <div className="px-2 flex flex-row text-lg w-full">
              <Image
                  className="rounded-sm h-48 w-48 object-cover object-center"
                  src={ct.st1_pic}
                  alt=""
                  width={400}
                  height={400}
                  security='https'
                  placeholder="blur"
                  blurDataURL={ct.st1_pic}
              />
              <h3 className="pl-2 flex w-80">{ct.st1_text}</h3>
            </div>
          </div>
          }
          <br />
          {ct.st2_pic && <div>
            <div className="px-2 flex flex-row text-lg w-full">
            <Image
            className="rounded-sm h-48 w-48 object-cover object-center"
            src={ct.st2_pic}
            alt=""
            width={400}
            height={400}
            security='https'
            placeholder="blur"
            blurDataURL={ct.st2_pic}
        />
            <h3 className="pl-2 flex w-80">{ct.st2_text}</h3>
          </div>
        </div>}
        <br />
        {ct.st3_pic && <div>
          <div className="px-2 flex flex-row text-lg w-full">
            <Image
                className="rounded-sm h-48 w-48 object-cover object-center"
                src={ct.st3_pic}
                alt=""
                width={400}
                height={400}
                security='https'
                placeholder="blur"
                blurDataURL={ct.st3_pic}
            />
              <h3 className="pl-2 flex w-80">{ct.st3_text}</h3>
            </div>
          </div>
          }
          <br />
          {ct.st4_pic && <div>
            <div className="px-2 flex flex-row text-lg w-full">
            <Image
            className="rounded-sm h-48 w-48 object-cover object-center"
            src={ct.st4_pic}
            alt=""
            width={400}
            height={400}
            security='https'
            placeholder="blur"
            blurDataURL={ct.st4_pic}
        />
            <h3 className="pl-2 flex w-80">{ct.st4_text}</h3>
          </div>
          </div>}
          <br />
          {ct.st5_pic && <div>
            <div className="px-2 flex flex-row text-lg w-full">
            <Image
                className="rounded-sm h-48 w-48 object-cover object-center"
                src={ct.st5_pic}
                alt=""
                width={400}
                height={400}
                security='https'
                placeholder="blur"
                blurDataURL={ct.st5_pic}
            />
              <h3 className="pl-2 flex w-80">{ct.st5_text}</h3>
            </div>
          </div>
          }
          <br />
          {ct.st6_pic && <div>
            <div className="px-2 flex flex-row text-lg w-full">
            <Image
            className="rounded-sm h-48 w-48 object-cover object-center"
            src={ct.st6_pic}
            alt=""
            width={400}
            height={400}
            security='https'
            placeholder="blur"
            blurDataURL={ct.st6_pic}
          />
              <h3 className="pl-2 flex w-80">{ct.st6_text}</h3>
            </div>
          </div>}
          <br />
        </div>
      ))}
    </div>
    )
}
