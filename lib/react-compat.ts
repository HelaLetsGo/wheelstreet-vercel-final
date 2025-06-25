"use client"

import React from "react"

// This file provides compatibility for React features that might not be available
// in the current React version

/**
 * A compatibility implementation of useEffectEvent
 * This is a simplified version that maintains the basic functionality
 * while avoiding the actual React implementation that's causing build errors
 */
export function useEffectEvent<T extends (...args: any[]) => any>(callback: T): T {
  const callbackRef = React.useRef(callback)

  React.useEffect(() => {
    callbackRef.current = callback
  })

  // @ts-ignore - This is a simplified implementation
  return React.useCallback((...args) => {
    return callbackRef.current(...args)
  }, [])
}
