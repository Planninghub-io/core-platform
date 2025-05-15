
import * as React from "react"
import { toast as toastFunction } from "@/components/ui/use-toast"

// Re-export the toast function
export const toast = toastFunction

// Re-export the useToast hook
export function useToast() {
  return {
    toast,
    toasts: [],
    dismiss: () => {}
  }
}

// Export the Toaster component from a different location to avoid circular dependencies
export { Toaster } from "@/components/ui/toaster"
