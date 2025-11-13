function buildMenuSections (containerId) {
  const container = document.getElementById(containerId)
  if (!container) return

  // cria container principal
  const wrapper = document.createElement('div')
  wrapper.className = 'container-fluid bg-success'

  const row = document.createElement('div')
  row.className = 'row h-100'

  const col = document.createElement('div')
  col.className = 'col-12'

  // cria cada section a partir de navbarLinks
  navbarLinks.forEach(link => {
    const section = document.createElement('section')
    section.id = link.id
    section.className = 'row'
    // section.style.backgroundColor = link.color
    section.style.height = '800px'

    const innerDiv = document.createElement('div')
    innerDiv.className =
      'col-12 text-center fw-bold d-flex align-items-center justify-content-center'
    innerDiv.textContent = link.label

    // opcional: texto branco para seções escuras
    // if (['red', 'blue'].includes(link.color)) {
    //   innerDiv.classList.add('text-white')
    // }

    section.appendChild(innerDiv)
    col.appendChild(section)
  })

  row.appendChild(col)
  wrapper.appendChild(row)
  container.appendChild(wrapper)
}
