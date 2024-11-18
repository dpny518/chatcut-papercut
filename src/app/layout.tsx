// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { FileSystemProvider } from "@/contexts/FileSystemContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSideBar"
import CenterPanel from "@/components/CenterPanel"
import { RightPanelContainer } from "@/components/RightPanel"
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
            <div className="flex h-screen overflow-hidden">
              {/* Left Panel - Collapsible on smaller screens */}
              <div className="w-[10%] min-w-[200px] max-w-[280px] flex-shrink-0 border-r border-gray-200 overflow-auto
                              fixed inset-y-0 left-0 z-30 bg-white
                              transform transition-transform duration-300 ease-in-out
                              lg:relative lg:translate-x-0
                              -translate-x-full">
                <AppSidebar />
              </div>
              
              {/* Main content area */}
              <div className="flex-1 flex overflow-hidden">
                {/* Center Panel */}
                <div className="w-[50%] overflow-auto">
                  <CenterPanel />
                </div>
                
                {/* Right Panel */}
                <div className="w-[50%] overflow-auto border-l border-gray-200">
                  <RightPanelContainer />
                </div>
              </div>
            </div>
          </SidebarProvider>
        </FileSystemProvider>
      </body>
    </html>
  )
}