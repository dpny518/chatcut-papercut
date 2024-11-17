import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import CenterPanel from "@/components/CenterPanel"
import { RightPanelContainer } from "@/components/RightPanel"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChatCut PaperCut',
  description: 'A Next.js based editor application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            <div className="w-64 flex-shrink-0">
              <AppSidebar />
            </div>
            <div className="flex flex-1 min-w-0">
              <div className="w-[45%] border-r border-gray-200">
                <CenterPanel />
              </div>
              <div className="w-[45%]">
                <RightPanelContainer />
              </div>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}