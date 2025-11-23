;(async function () {
  function waitForSections (timeout = 8000) {
    return new Promise(resolve => {
      const check = () => {
        const menu = document.getElementById('menu-placeholder')
        if (!menu) return false

        const sections = menu.querySelectorAll('section')
        if (sections.length) {
          resolve({ menu, sections })
          return true
        }
        return false
      }

      if (check()) return

      const observer = new MutationObserver(check)
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
    console.warn('scrollspy: menu ou sections não encontrados.')
    return
  }

  const navLinks = document.querySelectorAll('.navbar a')
  const navbar = document.querySelector('.navbar')
  const navbarHeight = navbar.getBoundingClientRect().height

  // Garantir que a primeira secção NÃO fica escondida
  sections[0].style.scrollMarginTop = `${navbarHeight}px`

  // Ajustar ultima secção para ficar colada ao topo quando clicada
  const adjustLastSection = () => {
    const last = sections[sections.length - 1]
    const visible = menu.clientHeight
    const sectionHeight = last.scrollHeight

    if (sectionHeight < visible) {
      last.style.minHeight = `${visible + navbarHeight}px`
    } else {
      last.style.minHeight = ''
    }
  }
  adjustLastSection()
  window.addEventListener('resize', adjustLastSection)

  // Atualiza active ao fazer scroll
  let nextSection = null

  const updateActive = () => {
    if (!nextSection) {
      return
    }
    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${nextSection.id}`
      )
    })
  }

  const updateActiveViaScroll = () => {
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

    navLinks.forEach(link => {
      const setActiveClass =
        link.getAttribute('href') === `#${currentSection.id}`
      link.classList.toggle('active', setActiveClass)
      if (setActiveClass) nextSection = currentSection
    })

    updateActive()
  }

  menu.addEventListener('scroll', updateActiveViaScroll)
  window.addEventListener('resize', updateActiveViaScroll)

  // Clique nos links
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault()
      const id = a.getAttribute('href').substring(1)
      const target = document.getElementById(id)
      if (!target) return

      const top = target.offsetTop - navbarHeight + 5

      // Atualiza active imediatamente
      nextSection = target

      // Scroll suave nativo sem bloquear o scrollspy
      menu.scrollTo({
        top,
        behavior: 'smooth'
      })
    })
  })
})()
