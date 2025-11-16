async function buildMenuSections (containerId) {
  const container = document.getElementById(containerId)
  if (!container) return

  let templateHTML = ''
  try {
    templateHTML = await fetch('./item-template.html').then(r => r.text())
  } catch (error) {
    console.error('Erro ao carregar item-template.html:', error)
    return
  }

  // Container principal
  const wrapper = document.createElement('div')
  wrapper.className = 'container-fluid'

  data.menus.forEach(menu => {
    // Cada seção é independente
    const section = document.createElement('section')
    section.id = menu.id
    section.className = 'py-4'

    // Título
    const title = document.createElement('div')
    title.className =
      'text-center fw-bold d-flex align-items-center justify-content-center mb-4'
    title.textContent = menu.label
    section.appendChild(title)

    // Container de itens
    const itemsRow = document.createElement('div')
    itemsRow.className = 'row justify-content-center'

    // Criar itens ativos
    menu.itens
      .filter(item => item.ativo)
      .forEach(item => {
        const wrapperDiv = document.createElement('div')
        wrapperDiv.innerHTML = templateHTML.trim()
        const itemDiv = wrapperDiv.firstElementChild

        const imgEl = itemDiv.querySelector('.item-img')
        imgEl.src = item.urlImagem
        imgEl.alt = item.label

        imgEl.onerror = function () {
          if (!this.dataset.fallbackUsed) {
            this.dataset.fallbackUsed = true
            this.src = DEFAULT_IMG
          }
        }

        itemDiv.querySelector('.item-title').textContent = item.label
        itemDiv.querySelector('.item-description').textContent =
          item.description
        itemDiv.querySelector(
          '.item-price'
        ).textContent = `${item.preco.toFixed(2)}€`

        itemsRow.appendChild(itemDiv)
      })

    section.appendChild(itemsRow)

    // **Adicionar section diretamente ao wrapper**
    wrapper.appendChild(section)
  })

  container.appendChild(wrapper)
}
