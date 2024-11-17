// src/app/layout.tsx
import { SidebarProvider } from "@/components/ui/sidebar"
import { FileSystemProvider } from "@/contexts/FileSystemContext"
import { AppSidebar } from "@/components/AppSideBar"
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
        <FileSystemProvider>
          <SidebarProvider>
            <div className="grid h-screen grid-cols-[280px_minmax(500px,_1fr)_minmax(500px,_1fr)]">
              <div className="border-r border-gray-200">
                <AppSidebar />
              </div>
              <div className="border-r border-gray-200 p-4">
                <CenterPanel />
              </div>
              <div className="p-4">
                <RightPanelContainer />
              </div>
            </div>
          </SidebarProvider>
        </FileSystemProvider>
      </body>
    </html>
  )
}