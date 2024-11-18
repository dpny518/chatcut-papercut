// src/app/layout.tsx
import { Inter } from 'next/font/google'
import { Providers } from "@/components/Providers"
import { AppSidebar } from "@/components/AppSideBar"
import CenterPanel from "@/components/CenterPanel"
import { RightPanel } from "@/components/RightPanel"
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
        <Providers>
          <div className="flex h-screen overflow-hidden">
            {/* Left Panel - AppSidebar */}
            <div className="w-64 flex-shrink-0 border-r border-gray-200 overflow-auto
                            bg-white z-30
                            lg:relative
                            transition-all duration-300 ease-in-out">
              <AppSidebar />
            </div>
            
            {/* Main content area */}
            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
              {/* Center Panel */}
              <div className="flex-1 min-w-0 overflow-auto lg:w-1/2">
                <CenterPanel />
              </div>
              
              {/* Right Panel */}
              <div className="flex-1 min-w-0 overflow-auto lg:w-1/2 border-l border-gray-200">
                <RightPanel />
              </div>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}