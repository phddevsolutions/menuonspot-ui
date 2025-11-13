;(async function () {
  // Espera pelo menu e pelas sections
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

  // ScrollSpy
  const updateActiveLink = () => {
    let current = ''
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 75 // altura navbar
      if (menu.scrollTop >= sectionTop - section.clientHeight / 3) {
        current = section.id
      }
    })

    navLinks.forEach(link => {
      link.classList.remove('active')
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active')
      }
    })
  }

  menu.addEventListener('scroll', updateActiveLink)

  // Scroll suave
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      const targetId = link.getAttribute('href').substring(1)
      const targetSection = document.getElementById(targetId)
      if (targetSection) {
        menu.scrollTo({
          top: targetSection.offsetTop - 75,
          behavior: 'smooth'
        })
      }
    })
  })

  console.log('✅ scrollspy totalmente funcional instalado!')
})()
