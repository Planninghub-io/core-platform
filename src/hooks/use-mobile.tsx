
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Check if window exists (for SSR)
    if (typeof window === 'undefined') return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    // Use a more reliable way to detect changes
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    handleResize()
    
    // Add event listener with debounce for performance
    let timeoutId: number
    const debouncedResize = () => {
      clearTimeout(timeoutId)
      timeoutId = window.setTimeout(handleResize, 100)
    }
    
    window.addEventListener("resize", debouncedResize)
    
    // Also listen to device orientation changes for mobile
    window.addEventListener("orientationchange", handleResize)
    
    return () => {
      window.removeEventListener("resize", debouncedResize)
      window.removeEventListener("orientationchange", handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return isMobile
}
