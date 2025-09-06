import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

/**
 * AI Chatbot API Route for Jharkhand Municipal Corporation
 *
 * ENVIRONMENT VARIABLES REQUIRED:
 * - GOOGLE_GENERATIVE_AI_API_KEY: Your Gemini API key
 *
 * BACKEND INTEGRATION NOTES:
 * - Add conversation persistence with database storage
 * - Implement rate limiting and user authentication
 * - Add conversation context from municipal databases
 * - Connect to real-time municipal data APIs
 * - Add file upload handling for issue attachments
 * - Implement conversation analytics and logging
 * - Add multilingual support (Hindi, English, local languages)
 * - Connect to existing municipal systems (property tax, water billing, etc.)
 */

interface ChatMessage {
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

interface ChatRequest {
  message: string
  conversationHistory?: ChatMessage[]
  userRole?: string
  currentPage?: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], userRole, currentPage }: ChatRequest = await request.json()

    const apiKey = "AIzaSyAS-iHuKaaLm8Q4I7YY85s6M4cXoSgGPd4"

    console.log("[v0] Using API key:", apiKey ? "Key present" : "Key missing")

    // Build conversation context
    const conversationContext = conversationHistory
      .slice(-5) // Keep last 5 messages for context
      .map((msg) => `${msg.sender}: ${msg.text}`)
      .join("\n")

    // System prompt for Jharkhand Municipal Corporation context
    const systemPrompt = `You are an AI assistant for Jharkhand Municipal Corporation (JMC). You help citizens and municipal staff with:

MUNICIPAL SERVICES:
- Property tax inquiries and payments
- Water supply and billing issues
- Waste management and garbage collection
- Road maintenance and infrastructure
- Building permits and approvals
- Birth/death certificate applications
- Trade license applications
- Complaint registration and tracking

USER CONTEXT:
- User Role: ${userRole || "citizen"}
- Current Page: ${currentPage || "dashboard"}

RESPONSE GUIDELINES:
- Be helpful, professional, and government-appropriate
- Provide specific information about Jharkhand municipal services
- Guide users to appropriate departments or online services
- Use simple language accessible to all citizens
- Include relevant contact information when helpful
- For complex issues, suggest visiting municipal offices

Keep responses concise but informative. Always maintain a respectful, official tone suitable for government services.`

    const fullPrompt = `${systemPrompt}

Previous conversation:
${conversationContext}

Current user message: ${message}

Please provide a helpful response:`

    // Generate AI response using Gemini
    const { text } = await generateText({
      model: google("gemini-1.5-flash", {
        apiKey: apiKey, // Explicitly pass the API key
      }),
      prompt: fullPrompt,
      maxTokens: 300, // Keep responses concise
    })

    console.log("[v0] AI response generated successfully")

    return NextResponse.json({
      response: text,
      fallback: false,
    })
  } catch (error) {
    console.error("[v0] Chatbot API error:", error)

    // Fallback response for errors
    return NextResponse.json({
      response:
        "I'm experiencing technical difficulties. Please try again in a moment, or contact the municipal office directly for urgent matters.",
      fallback: true,
      error: true,
    })
  }
}

/**
 * FUTURE ENHANCEMENTS:
 *
 * 1. Database Integration:
 *    - Store conversations for analytics
 *    - User session management
 *    - Conversation history persistence
 *
 * 2. Municipal Data Integration:
 *    - Real-time property tax status
 *    - Water billing information
 *    - Complaint status tracking
 *    - Service availability updates
 *
 * 3. Advanced Features:
 *    - File upload for issue reporting
 *    - Voice message support
 *    - Multilingual responses
 *    - Handoff to human agents
 *    - Integration with existing municipal software
 *
 * 4. Security & Compliance:
 *    - Rate limiting per user
 *    - Content filtering
 *    - Audit logging
 *    - Data privacy compliance
 */
