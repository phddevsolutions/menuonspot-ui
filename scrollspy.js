;(async function () {
  function waitForSections (timeout = 8000) {
    return new Promise(resolve => {
      const checkSections = () => {
        const menu = document.getElementById('menu-placeholder')
        if (!menu) return false
        const sections = menu.querySelectorAll('section')
        if (sections.length) {
          resolve({ menu, sections })
          return true
        }
        return false
      }

      if (checkSections()) return

      const observer = new MutationObserver(() => checkSections())
      observer.observe(document.body, { childList: true, subtree: true })

      setTimeout(() => {
        observer.disconnect()
        const menu = document.getElementById('menu-placeholder')
        const sections = menu ? menu.querySelectorAll('section') : []
        resolve({ menu, sections })
      }, timeout)
    })
  }

  const { menu, sections } = await waitForSections()

  if (!menu || !sections.length) {
    console.warn('scrollspy: #menu-placeholder ou sections não encontrados.')
    return
  }

  const navLinks = document.querySelectorAll('.navbar a')
  const footerHeight =
    document.getElementById('footer-placeholder')?.offsetHeight || 0
  const navbarHeight = 75

  const updateActiveLink = () => {
    let current = ''
    sections.forEach(section => {
      const rect = section.getBoundingClientRect()
      if (
        rect.top <= navbarHeight &&
        rect.bottom > navbarHeight + footerHeight
      ) {
        current = section.id
      }
    })

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      )
    })
  }

  window.addEventListener('scroll', updateActiveLink)
  menu.addEventListener('scroll', updateActiveLink)

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      const targetId = link.getAttribute('href').substring(1)
      const targetSection = document.getElementById(targetId)
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  })

  updateActiveLink()
  console.log('✅ ScrollSpy final instalado!')
})()
