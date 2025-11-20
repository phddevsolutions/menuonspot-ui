function buildHeader () {
  const headerContainer = document.getElementById('header-placeholder')
  if (!headerContainer) return

  const navbar = document.createElement('div')
  navbar.className = 'navbar height75'

  data.menus
    .sort((a, b) => a.label.localeCompare(b.label)) // sort by label
    .forEach((menu, index) => {
      const a = document.createElement('a')
      a.href = `#${menu.id}`
      a.textContent = menu.label

      if (index === 0) a.classList.add('active') // primeiro link ativo

      navbar.appendChild(a)
    })

  headerContainer.appendChild(navbar)

  if (typeof initScrollSpy === 'function') initScrollSpy()
}
