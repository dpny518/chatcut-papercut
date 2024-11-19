// src/components/Providers.tsx
import { FileSystemProvider } from "@/contexts/FileSystemContext"
import { EditorProvider } from "@/contexts/EditorContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import { RightPanelProvider } from "@/contexts/RightPanelContext"
import { CopyProvider } from "@/contexts/CopyContext"
import { GreenHighlightProvider, RedHighlightProvider } from "@/contexts/HighlightContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FileSystemProvider>
      <EditorProvider>
        <SidebarProvider>
          <RightPanelProvider>
            <CopyProvider>
              <GreenHighlightProvider>
                <RedHighlightProvider>
                  {children}
                </RedHighlightProvider>
              </GreenHighlightProvider>
            </CopyProvider>
          </RightPanelProvider>
        </SidebarProvider>
      </EditorProvider>
    </FileSystemProvider>
  )
}