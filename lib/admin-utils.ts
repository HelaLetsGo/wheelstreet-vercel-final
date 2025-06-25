/**
 * Finds all editable elements within a container and adds edit buttons next to them
 * @param container The container element to search within
 * @param onEdit Callback function when edit button is clicked
 */
export function addEditButtonsToElements(container: HTMLElement | null, onEdit: () => void): void {
  if (!container) return

  // Remove any existing edit buttons to prevent duplicates
  container.querySelectorAll(".inline-edit-button").forEach((btn) => btn.remove())

  // We'll only add edit buttons to main headings, not every element
  const editableElements = container.querySelectorAll("h1, h2")

  // Add edit buttons only to main headings
  editableElements.forEach((element) => {
    // Check if this element already has an edit button
    if (element.querySelector(".inline-edit-button")) return

    const button = document.createElement("button")
    button.className =
      "inline-edit-button absolute -right-8 top-1/2 transform -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity hover:bg-black group-hover:opacity-100"
    button.setAttribute("aria-label", "Edit text")

    // Create pencil icon
    const icon = document.createElement("span")
    icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path></svg>`

    button.appendChild(icon)
    button.addEventListener("click", (e) => {
      e.stopPropagation()
      onEdit()
    })

    // Make the element position relative if it's not already
    if (window.getComputedStyle(element).position === "static") {
      ;(element as HTMLElement).style.position = "relative"
    }

    element.appendChild(button)
  })
}
