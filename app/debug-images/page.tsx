"use client"

import Image from "next/image"
import { formatTeamMemberImagePath } from "@/lib/image-utils"

export default function DebugImagesPage() {
  const testCases = [
    { name: "Juras Lukas Kremensas", path: "/team/juras-lukas-kremensas.jpeg" },
    { name: "Karolis Murachimovas", path: "/team/karolis-murachimovas.jpeg" },
    { name: "Julius Jankauskas", path: "/team/julius-jankauskas.jpg" },
    { name: "Mantas Jauga", path: "/team/mantas-jauga.jpg" }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🖼️ Image Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testCases.map((testCase) => {
            const formattedPath = formatTeamMemberImagePath(testCase.path)
            
            return (
              <div key={testCase.name} className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{testCase.name}</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Original Path:</p>
                    <code className="text-green-400">{testCase.path}</code>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Formatted Path:</p>
                    <code className="text-blue-400">{formattedPath}</code>
                  </div>
                  
                  {/* Direct img tag test */}
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Direct img tag:</p>
                    <img 
                      src={formattedPath} 
                      alt={testCase.name}
                      className="w-32 h-32 object-cover rounded border-2 border-gray-600"
                      onLoad={() => console.log(`✅ Direct img loaded: ${formattedPath}`)}
                      onError={(e) => {
                        console.log(`❌ Direct img failed: ${formattedPath}`)
                        const target = e.target as HTMLImageElement
                        target.style.border = "2px solid red"
                      }}
                    />
                  </div>
                  
                  {/* Next.js Image component test */}
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Next.js Image:</p>
                    <Image
                      src={formattedPath}
                      alt={testCase.name}
                      width={128}
                      height={128}
                      className="w-32 h-32 object-cover rounded border-2 border-gray-600"
                      onLoad={() => console.log(`✅ Next.js Image loaded: ${formattedPath}`)}
                      onError={(e) => {
                        console.log(`❌ Next.js Image failed: ${formattedPath}`)
                        const target = e.target as HTMLImageElement
                        target.style.border = "2px solid red"
                      }}
                    />
                  </div>
                  
                  {/* Fetch test */}
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch(formattedPath)
                        console.log(`🌐 Fetch ${formattedPath}: ${response.status} ${response.statusText}`)
                        if (!response.ok) {
                          console.error(`Failed to fetch ${formattedPath}`)
                        }
                      } catch (err) {
                        console.error(`Error fetching ${formattedPath}:`, err)
                      }
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Test Fetch
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">File System Check</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Expected files in public/team/:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-300">
              <li>juras-lukas-kremensas.jpeg</li>
              <li>karolis-murachimovas.jpeg</li>
              <li>julius-jankauskas.jpg</li>
              <li>mantas-jauga.jpg</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}