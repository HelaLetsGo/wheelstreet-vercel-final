/**
 * Ensures that an image source is valid, providing a fallback if not
 * @param src The primary image source
 * @param fallback The fallback image source
 * @returns A valid image source
 */
export function ensureImageSrc(src: string | undefined | null, fallback: string): string {
  if (!src) return fallback

  // If it's a remote URL, return it directly
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src
  }

  // If it's a local path, ensure it starts with a slash
  if (!src.startsWith("/")) {
    return `/${src}`
  }

  return src
}

/**
 * Available team member photos in the public/team directory
 */
const AVAILABLE_TEAM_PHOTOS = [
  'julius-jankauskas.jpg',
  'juras-lukas-kremensas.jpeg', 
  'karolis-murachimovas.jpeg',
  'mantas-jauga.jpg',
  'martynas-linge.jpg',
  'nedas-mockevicius.jpg',
  'nikita-kovalenkov.jpeg',
  'vainius-mirskis.jpg',
  'vytautas-balodas.jpg'
].sort() // Keep alphabetically sorted

/**
 * Formats the team member image path to ensure it points to the correct location
 * @param imagePath The image path from the database
 * @returns A properly formatted image path
 */
export function formatTeamMemberImagePath(imagePath: string | undefined | null): string {
  if (!imagePath) return "/team-placeholder.svg"

  // Extract filename from path
  let filename = imagePath
  if (filename.includes('/')) {
    filename = filename.split('/').pop() || ''
  }

  // Check if the file exists in our available photos (case-insensitive)
  const availablePhoto = AVAILABLE_TEAM_PHOTOS.find(
    photo => photo.toLowerCase() === filename.toLowerCase()
  )

  if (availablePhoto) {
    return `/team/${availablePhoto}`
  }

  // Fallback: if path already includes /team/, return it as is
  if (imagePath.includes("/team/")) {
    return imagePath
  }

  // If it's just a filename, add the /team/ prefix
  if (!imagePath.startsWith("/")) {
    return `/team/${imagePath}`
  }

  return imagePath
}

/**
 * Gets all available team photos for dropdown selection
 * @returns Array of available team photo filenames
 */
export function getAvailableTeamPhotos(): string[] {
  return AVAILABLE_TEAM_PHOTOS
}

/**
 * Generates a placeholder image URL
 * @param width The width of the placeholder image
 * @param height The height of the placeholder image
 * @param text The text to display on the placeholder image
 * @returns A placeholder image URL
 */
export function generatePlaceholderImage(width: number, height: number, text: string): string {
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(text)}`
}
