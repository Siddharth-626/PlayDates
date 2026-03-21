import { ChatDashBoard } from "@/components/chat/chatDashBoard"
import Navbar from "@/components/Navbar"
import { useAuth } from "@/context/authContext"
import { useRouter } from "next/router"
import { useEffect } from "react"

const Chats = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading]);

    if (loading || !user) return null;

    return (
        <div className=" bg-white dark:bg-gray-700">
            <Navbar />
            <ChatDashBoard />
        </div>
    )
}
export default Chats;
