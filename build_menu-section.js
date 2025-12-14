async function buildMenuSections (containerId) {
  const container = document.getElementById(containerId)
  if (!container) return

  const DEFAULT_IMG = './images/default.png'
  let templateHTML = ''
  try {
    templateHTML = await fetch('./item-template.html').then(r => r.text())
  } catch (error) {
    console.error('Erro ao carregar item-template.html:', error)
    return
  }

  const wrapper = document.createElement('div')
  wrapper.className = 'container-fluid'

  //fetch("https://raw.githubusercontent.com/TEU_UTILIZADOR/NOME_REPO/main/data.json")
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      data.menus
        .sort((a, b) => a.label.localeCompare(b.label))
        .forEach(menu => {
          const section = document.createElement('section')
          section.id = menu.id
          section.className = 'py-4'

          const title = document.createElement('div')
          title.className =
            'row text-center text-section align-items-start justify-content-center mb-2 title-section'
          title.textContent = menu.label
          section.appendChild(title)

          const itemsRow = document.createElement('div')
          itemsRow.className = 'container-fluid justify-content-center p-0'

          menu.itens
            .filter(item => item.ativo)
            .sort((a, b) => a.label.localeCompare(b.label)) // sort by label
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
                  this.classList.add('spin-y')
                }
              }

              if (imgEl.src.split('/').pop() === DEFAULT_IMG.split('/').pop()) {
                imgEl.classList.add('spin-y')
              }

              itemDiv.querySelector('.item-title').textContent = item.label
              const descEl = itemDiv.querySelector('.item-description')
              descEl.textContent = item.description
              const rawPrice = String(item.preco).replace(',', '.')
              const price = parseFloat(rawPrice)

              itemDiv.querySelector('.item-price').textContent = isNaN(price)
                ? '0.00€'
                : `${price.toFixed(2).replace('.', ',')}€`

              if (item.novo) {
                itemDiv.querySelector('.show-new').style.display =
                  'inline-block'
              }
              if (item.porEncomenda) {
                itemDiv.querySelector('.show-order').style.display =
                  'inline-block'
              }

              itemsRow.appendChild(itemDiv)
            })

          section.appendChild(itemsRow)
          wrapper.appendChild(section)
        })
    })
    .catch(err => console.error('Erro ao carregar o JSON:', err))
  container.appendChild(wrapper)

  document.querySelectorAll('.item-description').forEach(desc => {
    const maxLength = 100 // ou qualquer limite de caracteres
    const fullText = desc.textContent

    if (fullText.length > maxLength) {
      const visibleText = fullText.slice(0, maxLength)

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
