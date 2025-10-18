import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ChatContextType {
  isChatMode: boolean;
  setIsChatMode: (isChatMode: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isChatMode, setIsChatMode] = useState<boolean>(false);

  return (
    <ChatContext.Provider value={{ isChatMode, setIsChatMode }}>
      {children}
    </ChatContext.Provider>
  );
};
