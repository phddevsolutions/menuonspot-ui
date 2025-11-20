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

  const wrapper = document.createElement('div')
  wrapper.className = 'container-fluid'

  data.menus
    .sort((a, b) => a.label.localeCompare(b.label)) // sort by label
    .forEach(menu => {
      const section = document.createElement('section')
      section.id = menu.id
      section.className = 'py-4'

      const title = document.createElement('div')
      title.className =
        'row text-center text-section align-items-center justify-content-center mb-4'
      title.textContent = menu.label
      section.appendChild(title)

      const itemsRow = document.createElement('div')
      itemsRow.className = 'container-fluid justify-content-center p-0'

      menu.itens
        .filter(item => item.ativo)
        .sort((a, b) => a.label.localeCompare(b.label))   // sort by label
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
          const descEl = itemDiv.querySelector('.item-description')
          descEl.textContent = item.description
          itemDiv.querySelector(
            '.item-price'
          ).textContent = `${item.preco.toFixed(2)}€`

          itemsRow.appendChild(itemDiv)
        })

      section.appendChild(itemsRow)
      wrapper.appendChild(section)
    })

  container.appendChild(wrapper)

  // =========================
  // FUNÇÃO MAIS/MENOS
  // =========================
  document.querySelectorAll('.item-description').forEach(desc => {
    const maxLength = 100 // ou qualquer limite de caracteres
    const fullText = desc.textContent

    if (fullText.length > maxLength) {
      const visibleText = fullText.slice(0, maxLength)
      const hiddenText = fullText.slice(maxLength)

      desc.textContent = visibleText

      const more = document.createElement('span')
      more.textContent = '... mais'
      more.style.color = '#007bff'
      more.style.cursor = 'pointer'

      more.addEventListener('click', () => {
        if (desc.textContent.endsWith('... mais')) {
          desc.textContent = fullText
          more.textContent = ' menos'
          desc.appendChild(more)
        } else {
          desc.textContent = visibleText
          more.textContent = '... mais'
          desc.appendChild(more)
        }
      })

      desc.appendChild(more)
    }
  })
}
