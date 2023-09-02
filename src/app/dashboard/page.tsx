import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const dashboard = async() => {
    const session = await getServerSession(authOptions)
    console.log(session)
    return(
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default dashboard;