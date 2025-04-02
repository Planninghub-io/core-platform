
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check if window exists (for SSR)
    if (typeof window === 'undefined') return

    // Use a more reliable way to detect changes
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Initial check
    handleResize()
    
    // Add event listener with debounce for performance
    let timeoutId: number | undefined
    const debouncedResize = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = window.setTimeout(handleResize, 100)
    }
    
    window.addEventListener("resize", debouncedResize)
    
    // Also listen to device orientation changes for mobile
    window.addEventListener("orientationchange", handleResize)
    
    return () => {
      window.removeEventListener("resize", debouncedResize)
      window.removeEventListener("orientationchange", handleResize)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  return isMobile
}
