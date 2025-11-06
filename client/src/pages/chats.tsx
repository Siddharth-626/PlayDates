import { ChatDashBoard } from "@/components/chat/chatDashBoard"
import Navbar from "@/components/Navbar"

const Chats = () => {
    return (
        <div className=" bg-white dark:bg-gray-700">
            <Navbar />
            <ChatDashBoard />
        </div>
    )
}
export default Chats;