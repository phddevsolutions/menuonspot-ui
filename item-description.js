document.addEventListener('DOMContentLoaded', () => {
  const descriptions = document.querySelectorAll('.item-description')

  descriptions.forEach(desc => {
    // Skip if already processed
    if (desc.dataset.processed) return

    const originalText = desc.textContent
    const maxHeight = 3 * parseFloat(getComputedStyle(desc).lineHeight) // roughly 2 lines
    desc.dataset.originalText = originalText

    if (desc.scrollHeight > maxHeight) {
      // Create "mais" link
      const readMore = document.createElement('span')
      readMore.textContent = ' mais'
      readMore.className = 'read-more'

      readMore.addEventListener('click', () => {
        desc.classList.toggle('expanded')
        readMore.textContent = desc.classList.contains('expanded')
          ? ' menos'
          : ' mais'
      })

      desc.appendChild(readMore)
    }

    desc.dataset.processed = true
  })
})
