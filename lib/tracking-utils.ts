// Facebook Pixel tracking utility functions
export const trackLeadConversion = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Lead")
  }
}

export const trackCompleteRegistration = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "CompleteRegistration")
  }
}

export const trackContact = () => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Contact")
  }
}

// Add TypeScript declaration for fbq
declare global {
  interface Window {
    fbq: any
  }
}
