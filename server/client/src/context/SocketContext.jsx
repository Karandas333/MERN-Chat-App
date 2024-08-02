import { useAppStore } from "@/store";
import { HOST } from "@/utiles/contants";
import { createContext, useContext, useEffect, useRef }from "react"
import { io } from "socket.io-client";


const SocketContext = createContext(null)

export const useSocket = () => {
  return useContext(SocketContext);
}
export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query:{userId:userInfo._id}
      });



      socket.current.on('connect', () => {
      console.log('Connected to Socket server.')
      })
      
      const handelreciveMessage = (message) => {
        const { selectedChatType, selectedChatData ,addMessage,addConatactsInDMContacts} = useAppStore.getState();
        if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
          addMessage(message)

        }
        addConatactsInDMContacts(message)
      }
      const handelReciveChannelMessage = (message) => {
        const { selectedChatType, selectedChatData, addMessage,addChannelInChannelList } = useAppStore.getState();
         if (selectedChatType !== undefined && selectedChatData._id === message.channelId ) {
          addMessage(message)
        }
        addChannelInChannelList(message)
      }

      socket.current.on('reciveMessage', handelreciveMessage)
      socket.current.on('recive-channel-message',handelReciveChannelMessage)

      return () => {
        socket.current.disconnect()
      }

    }
  }, [userInfo])
  
  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  )
}