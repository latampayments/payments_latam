import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const dashboard = async() => {
    const session = await getServerSession(authOptions);

    if(!session) {
        return(
            <h2 className='text-2xl'>Not logged in, you need to sign in to see the content.</h2>
        )
    };

    return(
        <div>
            <h1>{session?.user.username}: Dashboard</h1>
        </div>
    )
}

export default dashboard;