import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/hooks/use-auth"
import { LanguageProvider } from "@/contexts/language-context"
import { ULBProvider } from "@/contexts/ulb-context"
import { Suspense } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import "./globals.css"

// Add CSS for country flags
const flagIconsCSS = `
  .fi {
    background-size: contain;
    background-position: 50%;
    background-repeat: no-repeat;
    position: relative;
    display: inline-block;
    width: 1.33333333em;
    line-height: 1em;
  }
  .fi:before {
    content: '\\00a0';
  }
  .fi-gb {
    background-image: url(https://flagcdn.com/w40/gb.png);
  }
  .fi-in {
    background-image: url(https://flagcdn.com/w40/in.png);
  }
`;

export const metadata: Metadata = {
  title: "Jharkhand Municipal Corporation Dashboard",
  description:
    "Digital governance platform for Jharkhand Municipal Corporation - Citizen services, issue management, and community engagement",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: flagIconsCSS }} />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-gray-50`}>
        <Suspense>
          <AuthProvider>
            <LanguageProvider>
              <ULBProvider>
                <AppLayout>
                  {children}
                </AppLayout>
                <Analytics />
              </ULBProvider>
            </LanguageProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  )
}
