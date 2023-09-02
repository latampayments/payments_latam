import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const dashboard = async() => {
    const session = await getServerSession(authOptions);

    if(!session) return;

    return(
        <div>
            <h1>{session?.user.username}: Dashboard</h1>
        </div>
    )
}

export default dashboard;