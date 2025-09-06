/**
 * Rule-based chatbot engine for Jharkhand Municipal Corporation
 *
 * BACKEND INTEGRATION NOTES:
 * - Replace this rule engine with AI API integration (OpenAI, Gemini, or custom LLM)
 * - Add conversation context management and memory
 * - Implement intent recognition and entity extraction
 * - Add multilingual support (Hindi, English, local languages)
 * - Connect to real-time municipal data APIs
 * - Add authentication for sensitive queries
 * - Implement conversation analytics and feedback collection
 */

export interface ChatMessage {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "text" | "action" | "quick-reply"
}

export interface QuickAction {
  id: string
  label: string
  action: string
  icon?: string
}

// Rule-based response patterns
const responsePatterns = [
  // Issue Status Queries
  {
    patterns: ["status", "issue", "#", "complaint"],
    responses: [
      "I can help you check issue status. Please provide the issue ID (e.g., #12345) or describe your concern.",
      "To check issue status, you can visit the Issues section or provide me with your complaint number.",
    ],
  },

  // KPI and Statistics
  {
    patterns: ["how many", "total", "pending", "resolved", "statistics"],
    responses: [
      "Currently we have 156 total issues, with 89 pending and 67 resolved. You can view detailed statistics in the Analytics section.",
      "Our latest statistics show good progress on municipal issues. Check the Dashboard for real-time KPIs.",
    ],
  },

  // Navigation Help
  {
    patterns: ["how to", "where", "find", "access", "navigate"],
    responses: [
      "You can navigate using the sidebar menu. Issues are in the Issues section, reports in Analytics, and community events in Community.",
      "Use the left sidebar to access different sections. Need help with a specific feature?",
    ],
  },

  // Jharkhand Specific
  {
    patterns: ["jharkhand", "government", "portal", "services", "municipality"],
    responses: [
      "Jharkhand Municipal Corporation provides various citizen services. You can access government portals through our integrations section.",
      "For Jharkhand-specific services, check our Government Integrations section or visit the official state portal.",
    ],
  },

  // Greetings
  {
    patterns: ["hello", "hi", "hey", "good morning", "good afternoon", "namaste"],
    responses: [
      "Namaste! Welcome to Jharkhand Municipal Corporation dashboard. How can I assist you today?",
      "Hello! I'm here to help you navigate the municipal services. What would you like to know?",
    ],
  },

  // Default fallback
  {
    patterns: ["default"],
    responses: [
      "I'm here to help with municipal services, issue tracking, and navigation. Could you please rephrase your question?",
      "I can assist with issues, statistics, navigation, and Jharkhand government services. How can I help you?",
    ],
  },
]

export const quickActions: QuickAction[] = [
  { id: "check-issues", label: "Check Issues", action: "navigate:/issues" },
  { id: "view-stats", label: "View Statistics", action: "navigate:/analytics" },
  { id: "report-issue", label: "Report New Issue", action: "modal:create-issue" },
  { id: "contact-support", label: "Contact Support", action: "modal:contact" },
]

export function generateBotResponse(userMessage: string): ChatMessage {
  const lowerMessage = userMessage.toLowerCase()

  // Find matching pattern
  let selectedResponse = responsePatterns[responsePatterns.length - 1].responses[0] // Default

  for (const pattern of responsePatterns) {
    if (pattern.patterns.some((p) => lowerMessage.includes(p))) {
      selectedResponse = pattern.responses[Math.floor(Math.random() * pattern.responses.length)]
      break
    }
  }

  return {
    id: Date.now().toString(),
    text: selectedResponse,
    sender: "bot",
    timestamp: new Date(),
    type: "text",
  }
}

/**
 * FUTURE AI INTEGRATION EXAMPLE:
 *
 * export async function generateAIResponse(userMessage: string, context: ChatContext): Promise<ChatMessage> {
 *   try {
 *     const response = await fetch('/api/chatbot', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({
 *         message: userMessage,
 *         context: context,
 *         userId: getCurrentUser().id,
 *         municipalData: await getMunicipalContext()
 *       })
 *     })
 *
 *     const aiResponse = await response.json()
 *
 *     return {
 *       id: aiResponse.id,
 *       text: aiResponse.message,
 *       sender: 'bot',
 *       timestamp: new Date(aiResponse.timestamp),
 *       type: aiResponse.type || 'text'
 *     }
 *   } catch (error) {
 *     console.error('AI API Error:', error)
 *     return generateBotResponse(userMessage) // Fallback to rules
 *   }
 * }
 */
