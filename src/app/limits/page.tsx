import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { getLimits } from "@/lib/api";
  
export default async function Limits() {
    const session = await getServerSession(authOptions);
    
    if(!session) {
        return redirect('/sign-in');
    }
    
    let {limits }= await getLimits();
    let data = limits.flat(Infinity);

    return(
        <>
            <Table>
                <TableHeader>
                    <TableRow  className="w-full text-center font-bold justify-center items-center">
                    <TableHead className="w-[100px] text-center font-bold">Country</TableHead>
                    <TableHead className="text-center font-bold">Bank</TableHead>
                    <TableHead className="text-center font-bold">Method</TableHead>
                    <TableHead className="text-center font-bold">Limits</TableHead>
                    <TableHead className="text-center font-bold">Information</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((ct: any) =>
                        ct.banks.map((bk: any) => 
                            bk.payment.map((py: any) =>
                            <TableRow key={bk.payment.id}>
                                <TableCell className="font-medium">{ct.country}</TableCell>
                                <TableCell>{bk.name}</TableCell>
                                <TableCell>{py.type}</TableCell>
                                <TableCell>{py.limits}</TableCell>
                                <TableCell className="text-right">{py.information}</TableCell>
                            </TableRow>
                            )
                    )
                    )}
                </TableBody>
            </Table>
        </>
    )
}