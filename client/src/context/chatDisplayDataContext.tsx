import { createContext, useContext, useState } from "react";

type ChatDisplayData = {
    chatId: string;
    name: string;
    photoUrl?: string;
    players?: { userUid: string; profileId: string; name: string; photoUrl?: string }[];
    userUid?: string;
    id?: string;
    type: "1-1" | "group" | "match";
};

type ChatDisplayDataContextType = {
    chatDisplayData: ChatDisplayData | undefined;
    setChatDisplayData: (chatDisplayData: ChatDisplayData | undefined) => void;
}

const ChatDisplayDataContext = createContext<ChatDisplayDataContextType | undefined>(undefined);


export const ChatDisplayDataProvider = ({children}:{children:React.ReactNode})=>{
    const [chatDisplayData,setChatDisplayData] = useState<ChatDisplayData | undefined>(undefined)
    return(
        <ChatDisplayDataContext.Provider value={{chatDisplayData,setChatDisplayData}}>
            {children}
        </ChatDisplayDataContext.Provider>
    );
}

export const useChatDisplayData = ()=>{
    const context = useContext(ChatDisplayDataContext);

    if(!context){
        throw new Error("Context not found");
    }
    return context;
}