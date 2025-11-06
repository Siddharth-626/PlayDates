import { createContext, useContext, useState } from "react";


type ChatDisplayDataContextType = {
    chatDisplayData:any,
    setChatDisplayData:(chatDisplayData:any) =>void;
}

const ChatDisplayDataContext = createContext<ChatDisplayDataContextType | undefined>(undefined);


export const ChatDisplayDataProvider = ({children}:{children:React.ReactNode})=>{
    const [chatDisplayData,setChatDisplayData] = useState<any>(undefined)
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