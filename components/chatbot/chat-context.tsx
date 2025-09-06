"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useChatbot } from "@/hooks/use-chatbot"
import type { ChatMessage } from "@/lib/chatbot-rules"

/**
 * Chat Context Provider for global chatbot state management
 *
 * BACKEND INTEGRATION NOTES:
 * - Add conversation persistence across page refreshes
 * - Implement conversation synchronization across devices
 * - Add real-time message delivery with WebSockets
 * - Store conversation history in database
 * - Add conversation analytics and insights
 */

interface ChatContextType {
  messages: ChatMessage[]
  isTyping: boolean
  sendMessage: (message: string) => Promise<void>
  clearConversation: () => void
  addMessage: (message: ChatMessage) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
}

export function ChatProvider({ children }: ChatProviderProps) {
  const chatbot = useChatbot()

  return <ChatContext.Provider value={chatbot}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
