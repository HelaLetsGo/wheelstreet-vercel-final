import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Define callback type
type DebugCallback = (operation: string, method: "success" | "error", params: any, result?: any, error?: any) => void

// Store callbacks
let debugCallbacks: DebugCallback[] = []

// Register a callback to receive debug information
export function registerSupabaseDebugCallback(callback: DebugCallback) {
  debugCallbacks.push(callback)
  return () => {
    debugCallbacks = debugCallbacks.filter((cb) => cb !== callback)
  }
}

// Create a debug-enabled Supabase client
export function createDebugSupabaseClient(): SupabaseClient {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase environment variables")
      throw new Error("Missing Supabase environment variables")
    }

    const client = createClient(supabaseUrl, supabaseAnonKey)

    // Create a proxy to intercept all method calls
    return new Proxy(client, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver)

        // If the property is a function, we want to intercept it
        if (typeof value === "function") {
          return function (...args: any[]) {
            // Call the original method
            const result = value.apply(this === receiver ? target : this, args)

            // If the result is a Promise, we want to intercept it
            if (result && typeof result.then === "function") {
              return result.then(
                (data: any) => {
                  // Notify all callbacks of the successful operation
                  try {
                    debugCallbacks.forEach((callback) => {
                      callback(`${String(prop)}`, "success", args, data)
                    })
                  } catch (e) {
                    console.error("Error in debug callback:", e)
                  }
                  return data
                },
                (error: any) => {
                  // Notify all callbacks of the failed operation
                  try {
                    debugCallbacks.forEach((callback) => {
                      callback(`${String(prop)}`, "error", args, undefined, error)
                    })
                  } catch (e) {
                    console.error("Error in debug callback:", e)
                  }
                  throw error
                },
              )
            }

            return result
          }
        }

        // If the property is an object with methods, we want to intercept those methods
        if (value && typeof value === "object") {
          return new Proxy(value, {
            get(obj, methodProp, methodReceiver) {
              const methodValue = Reflect.get(obj, methodProp, methodReceiver)

              if (typeof methodValue === "function") {
                return function (...methodArgs: any[]) {
                  // Call the original method
                  const methodResult = methodValue.apply(this === methodReceiver ? obj : this, methodArgs)

                  // If the result is a Promise, we want to intercept it
                  if (methodResult && typeof methodResult.then === "function") {
                    return methodResult.then(
                      (data: any) => {
                        // Notify all callbacks of the successful operation
                        try {
                          debugCallbacks.forEach((callback) => {
                            callback(`${String(prop)}.${String(methodProp)}`, "success", methodArgs, data)
                          })
                        } catch (e) {
                          console.error("Error in debug callback:", e)
                        }
                        return data
                      },
                      (error: any) => {
                        // Notify all callbacks of the failed operation
                        try {
                          debugCallbacks.forEach((callback) => {
                            callback(`${String(prop)}.${String(methodProp)}`, "error", methodArgs, undefined, error)
                          })
                        } catch (e) {
                          console.error("Error in debug callback:", e)
                        }
                        throw error
                      },
                    )
                  }

                  return methodResult
                }
              }

              return methodValue
            },
          })
        }

        return value
      },
    })
  } catch (error) {
    console.error("Error creating debug Supabase client:", error)
    // Fallback to regular client if debug client fails
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    return createClient(supabaseUrl, supabaseAnonKey)
  }
}
