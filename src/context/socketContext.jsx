import { useContext,createContext,useMemo } from "react";
import {io} from "socket.io-client";

const endPoint = 'https://mernchatserver-mup6.onrender.com';




const socketContext = createContext(null);

export function useSocket(){
    return useContext(socketContext).socket;
}

const SocketProvider = ({children}) => {
    const socket = useMemo(() => io(endPoint),[]);
    return(
    <socketContext.Provider
    value={{socket}}
    >
        {children}
    </socketContext.Provider>
    )
}




export default SocketProvider;