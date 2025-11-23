function buildHeader () {
  const headerContainer = document.getElementById('header-placeholder')
  if (!headerContainer) return

  // wrapper for fade shadows
  const wrapper = document.createElement('div')
  wrapper.className = 'navbar-wrapper'

  const shadowLeft = document.createElement('div')
  shadowLeft.className = 'shadow-left'

  const shadowRight = document.createElement('div')
  shadowRight.className = 'shadow-right'

  const navbar = document.createElement('div')
  navbar.className = 'navbar height48'

  wrapper.appendChild(navbar)
  headerContainer.appendChild(wrapper)

  data.menus
    .sort((a, b) => a.label.localeCompare(b.label)) // sort by label
    .forEach((menu, index) => {
      const a = document.createElement('a')
      a.href = `#${menu.id}`
      a.textContent = menu.label

      if (index === 0) a.classList.add('active') // primeiro link ativo

      navbar.appendChild(a)
    })

  wrapper.appendChild(shadowLeft)
  wrapper.appendChild(navbar)
  wrapper.appendChild(shadowRight)
  headerContainer.appendChild(wrapper)

  if (typeof initScrollSpy === 'function') initScrollSpy()
}
