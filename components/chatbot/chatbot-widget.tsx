"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { type ChatMessage, type QuickAction, generateBotResponse, quickActions } from "@/lib/chatbot-rules"
import { useAuth } from "@/hooks/use-auth"

/**
 * AI Chatbot Widget Component
 *
 * BACKEND INTEGRATION NOTES:
 * - Replace generateBotResponse with AI API calls
 * - Add WebSocket connection for real-time responses
 * - Implement conversation persistence in database
 * - Add typing indicators and message status
 * - Connect to municipal data APIs for contextual responses
 * - Add file upload support for issue attachments
 * - Implement conversation handoff to human agents
 * - Add multilingual support with language detection
 */

interface ChatbotWidgetProps {
  className?: string
}

export default function ChatbotWidget({ className }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isAIMode, setIsAIMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        text: `Namaste ${user?.name || "User"}! I'm your Jharkhand Municipal Corporation assistant. How can I help you today?`,
        sender: "bot",
        timestamp: new Date(),
        type: "text",
      }
      setMessages([welcomeMessage])
    }
  }, [user?.name, messages.length])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.slice(-10), // Send last 10 messages for context
          userRole: user?.role,
          currentPage: window.location.pathname,
        }),
      })

      const data = await response.json()

      if (data.fallback) {
        // Use rule-based response as fallback
        console.log("[v0] Using rule-based fallback response")
        const botResponse = generateBotResponse(currentInput)
        setMessages((prev) => [...prev, botResponse])
        setIsAIMode(false)
      } else {
        // Use AI response
        const aiResponse: ChatMessage = {
          id: Date.now().toString(),
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsAIMode(true)
      }
    } catch (error) {
      console.error("[v0] Chatbot error:", error)
      // Fallback to rule-based response
      const botResponse = generateBotResponse(currentInput)
      setMessages((prev) => [...prev, botResponse])
      setIsAIMode(false)
    }

    setIsTyping(false)
  }

  const handleQuickAction = (action: QuickAction) => {
    if (action.action.startsWith("navigate:")) {
      const path = action.action.replace("navigate:", "")
      window.location.href = path
    } else if (action.action.startsWith("modal:")) {
      // Handle modal actions
      console.log("Modal action:", action.action)
    }

    // Add user message for the action
    const actionMessage: ChatMessage = {
      id: Date.now().toString(),
      text: action.label,
      sender: "user",
      timestamp: new Date(),
      type: "action",
    }
    setMessages((prev) => [...prev, actionMessage])
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-xl z-50 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4" />
          JMC Assistant
          {isAIMode && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              AI
            </Badge>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 text-white hover:bg-blue-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-2 text-sm ${
                  message.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === "bot" && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                  {message.sender === "user" && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                  <span>{message.text}</span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-2 text-sm">
                <div className="flex items-center gap-2">
                  <Bot className="h-3 w-3" />
                  <span>Typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className="p-3 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-1">
              {quickActions.map((action) => (
                <Badge
                  key={action.id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 text-xs"
                  onClick={() => handleQuickAction(action)}
                >
                  {action.label}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="text-sm"
            />
            <Button onClick={handleSendMessage} size="icon" className="h-8 w-8 bg-blue-600 hover:bg-blue-700">
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
