/**
 * Environment Variables Configuration for Jharkhand Municipal Corporation Dashboard
 *
 * REQUIRED ENVIRONMENT VARIABLES:
 *
 * AI/Chatbot Integration:
 * - GOOGLE_GENERATIVE_AI_API_KEY: Your Gemini API key for AI chatbot functionality
 *
 * Database Integration (Future):
 * - DATABASE_URL: PostgreSQL/MySQL connection string for data persistence
 * - REDIS_URL: Redis connection for session management and caching
 *
 * Authentication (Future):
 * - NEXTAUTH_SECRET: Secret for NextAuth.js authentication
 * - NEXTAUTH_URL: Base URL for authentication callbacks
 *
 * Municipal System Integration (Future):
 * - JMC_API_BASE_URL: Base URL for Jharkhand Municipal Corporation APIs
 * - JMC_API_KEY: API key for municipal system integration
 * - PROPERTY_TAX_API_URL: Property tax system integration
 * - WATER_BILLING_API_URL: Water billing system integration
 *
 * File Storage (Future):
 * - AWS_ACCESS_KEY_ID: AWS S3 for file uploads
 * - AWS_SECRET_ACCESS_KEY: AWS S3 secret
 * - AWS_REGION: AWS region
 * - S3_BUCKET_NAME: S3 bucket for municipal documents
 *
 * Notification Services (Future):
 * - SMS_API_KEY: SMS service for citizen notifications
 * - EMAIL_SERVICE_API_KEY: Email service configuration
 *
 * SETUP INSTRUCTIONS:
 * 1. Copy this file to .env.local in your project root
 * 2. Fill in the required values
 * 3. Restart your development server
 *
 * SECURITY NOTES:
 * - Never commit .env files to version control
 * - Use different keys for development and production
 * - Regularly rotate API keys
 * - Follow principle of least privilege for API access
 */

export const env = {
  // AI Configuration
  GOOGLE_GENERATIVE_AI_API_KEY: process.env.GOOGLE_GENERATIVE_AI_API_KEY,

  // Database (Future)
  DATABASE_URL: process.env.DATABASE_URL,

  // Municipal Integration (Future)
  JMC_API_BASE_URL: process.env.JMC_API_BASE_URL,
  JMC_API_KEY: process.env.JMC_API_KEY,
} as const

// Validation helper
export function validateEnv() {
  const missing = []

  if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
    console.warn("[v0] GOOGLE_GENERATIVE_AI_API_KEY not found - chatbot will use fallback mode")
  }

  return missing
}
