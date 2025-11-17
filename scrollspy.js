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
  const navbarHeight = 75

  // Ajusta a última seção para que todos os itens fiquem visíveis
  const adjustLastSection = () => {
    const lastSection = sections[sections.length - 1]
    const containerHeight = menu.clientHeight
    const sectionHeight = lastSection.scrollHeight
    if (sectionHeight < containerHeight) {
      lastSection.style.minHeight = `${containerHeight}px`
    } else {
      lastSection.style.minHeight = ''
    }
  }
  adjustLastSection()
  window.addEventListener('resize', adjustLastSection)

  const updateActiveLink = () => {
    const scrollTop = menu.scrollTop + navbarHeight
    let currentSection = sections[0]

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const sectionTop = section.offsetTop
      const sectionBottom = sectionTop + section.offsetHeight

      if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
        currentSection = section
        break
      }
    }

    // Corrige o último tab quando chegamos ao final do scroll
    if (menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1) {
      currentSection = sections[sections.length - 1]
    }

    navLinks.forEach(link =>
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${currentSection.id}`
      )
    )
  }

  menu.addEventListener('scroll', updateActiveLink)
  window.addEventListener('resize', updateActiveLink)

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault()
      const targetId = link.getAttribute('href').substring(1)
      const targetSection = document.getElementById(targetId)
      if (targetSection) {
        menu.scrollTo({
          top: targetSection.offsetTop - navbarHeight,
          behavior: 'smooth'
        })
      }
    })
  })

  // Atualiza active ao iniciar
  updateActiveLink()
  console.log('✅ ScrollSpy final estável instalado!')
})()
