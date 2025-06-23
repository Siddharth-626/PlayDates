import { createContext, useContext, useEffect, useState } from "react";

type Theme = 'light' | 'dark';

interface ThemeType {
    theme : Theme,
    toggleTheme : ()=> void
}

const ThemeContext = createContext<ThemeType | undefined>(undefined);

 export const ThemeProvder = ({children}:{children:React.ReactNode})=>{
     const [theme,setTheme] = useState<Theme>(
        (typeof window !== 'undefined' && localStorage.getItem('theme') as Theme) || 'light'
     )

     useEffect(()=>{
        document.documentElement.classList.toggle('dark',theme === 'dark')
        localStorage.setItem('theme',theme)
     },[theme])
     const toggleTheme = ()=>{
        setTheme(theme == 'light' ?  "dark" :'light')
     }
     
     return(
        <ThemeContext.Provider value={{theme ,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
     )
}

export const useTheme = ()=>{
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within ThemeProvider");
    return context;
}
