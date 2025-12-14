// =====================================================
// 🔧 CONFIGURAÇÃO
// =====================================================
const OWNER = 'phddevsolutions'
const REPO = 'menuonspot-ui'
const BRANCH = 'main'
const FILE_PATH = 'data.json'
const WORKFLOW_FILE = 'update-data.yml'
const TOKEN_PROXY = 'https://vercel-git-proxy.vercel.app/api/token'
const CLIENT_ID = 'Ov23lieOlxeI1P0NX5ha'

const loginBtn = document.getElementById('loginBtn')
const saveBtn = document.getElementById('saveBtn')
const editor = document.getElementById('editor')

const menuEditor = document.getElementById('menuEditor')
const menuComplete = document.getElementById('menuComplete')
const jsonOutput = document.getElementById('jsonOutput')

let accessToken = null
let menus = [] // ← dados manipulados no editor visual

// =====================================================
// 🔹 Login GitHub
// =====================================================
loginBtn.onclick = () => {
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`
  window.location.href = url
}

// 🔹 Troca code → token via proxy
const params = new URLSearchParams(window.location.search)
const code = params.get('code')

if (code) {
  fetch(TOKEN_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, client_id: CLIENT_ID })
  })
    .then(r => r.json())
    .then(data => {
      accessToken = data.access_token
      loginBtn.style.display = 'none'
      history.replaceState({}, document.title, window.location.pathname)
      carregarDataJson()
    })
    .catch(err => {
      console.error(err)
      alert('Erro ao obter token do GitHub')
    })
}

// =====================================================
// 🔹 Carregar data.json
// =====================================================
async function carregarDataJson () {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    const data = await res.json()
    const bytes = Uint8Array.from(atob(data.content.replace(/\n/g, '')), c =>
      c.charCodeAt(0)
    )
    const content = new TextDecoder('utf-8').decode(bytes)

    // Preenche textarea raw
    editor.value = content
    editor.style.display = 'block'
    saveBtn.style.display = 'inline-block'

    // Preenche editor visual
    const parsed = JSON.parse(content)
    menus = parsed.menus
    menuEditor.style.display = 'block'
    menuComplete.style.display = 'block'
    refreshDropdownCategories()
  } catch (err) {
    console.error(err)
    alert('Erro ao carregar data.json')
  }
}

// =====================================================
// 🔹 Guardar alterações via workflow_dispatch
// =====================================================
saveBtn.onclick = async () => {
  try {
    // O conteúdo final é sempre o editor.raw
    const rawContent = editor.value
    const jsonObj = JSON.parse(rawContent) // valida JSON
    const newContent = JSON.stringify(jsonObj) // string segura

    const workflowUrl = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`

    const response = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ref: BRANCH,
        inputs: { content: newContent }
      })
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('GitHub API response:', text)
      throw new Error(`GitHub API error: ${response.status} - ${text}`)
    }

    alert('Alterações enviadas com sucesso!')
  } catch (err) {
    console.error(err)
    alert('Erro ao enviar alterações para o workflow.')
  }
}

// =====================================================
// 🟦 EDITOR VISUAL – Consistência de dados
// =====================================================

// Preenche dropdown de categorias
function refreshDropdownCategories () {
  const select = document.getElementById('categorySelect')
  select.innerHTML = ''

  const selectEdit = document.getElementById('categoryNameEdit')
  selectEdit.innerHTML = ''

  const selectToEdit = document.getElementById('categorySelectToEdit')
  selectToEdit.innerHTML = ''

  menus.forEach((m, index) => {
    const opt = document.createElement('option')
    opt.value = index
    opt.textContent = m.label
    select.appendChild(opt)
    selectEdit.appendChild(opt.cloneNode(true))
    selectToEdit.appendChild(opt.cloneNode(true))
  })

  refreshItems()
  updateJson()
}

// Mostra itens da categoria selecionada
function refreshItems () {
  const idx = parseInt(document.getElementById('categorySelect').value, 10)
  const ul = document.getElementById('itemsList')
  const itemSelect = document.getElementById('itemSelect')

  ul.innerHTML = ''
  itemSelect.innerHTML = ''

  const itens = menus[idx]?.itens || []

  itens.forEach((item, index) => {
    // Lista visual
    const li = document.createElement('li')
    li.textContent = `${item.label} – ${item.description} ${
      item.price ? ' (€' + item.price + ')' : ''
    }`
    // opcional: clicar no li preenche o form
    li.addEventListener('click', () => {
      itemSelect.value = index
      fillItemForm()
    })
    ul.appendChild(li)

    // Dropdown para selecionar item
    const opt = document.createElement('option')
    opt.value = index
    opt.textContent = item.label
    itemSelect.appendChild(opt)
  })

  // Se houver items, selecciona o primeiro e preenche o form
  if (itens.length > 0) {
    itemSelect.value = 0
    fillItemForm()
  } else {
    // limpa form se não houver items
    clearItemForm()
  }

  updateJson()
}

// Adicionar categoria
function addCategory () {
  const nameInput = document.getElementById('categoryName')
  const name = nameInput.value.trim()
  if (!name) return alert('Nova categoria vazia!')

  const exists = menus.some(m => m.label.toLowerCase() === name.toLowerCase())

  if (!exists) {
    menus.push({
      label: name,
      id: name.toLowerCase().replace(/\s+/g, '_'),
      itens: []
    })

    // menus.sort((a, b) =>
    //   a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    // )
    refreshDropdownCategories()
  }

  nameInput.value = ''
}

// Editar categoria
function editCategory () {
  const idx = document.getElementById('categoryNameEdit').value
  const nameInput = document.getElementById('categoryNameEditText')
  const name = nameInput.value.trim()
  if (!name) return alert('Nome da categoria é vazio!')

  menus[idx].label = name
  menus[idx].id = name.replace(/\s+/g, '_')

  refreshDropdownCategories()
  nameInput.value = ''
}

// Remover categoria
function removeCategory () {
  const idx = document.getElementById('categorySelect').value
  if (
    !confirm('A categoria e todos os items serão eliminados, Tem a certeza ?')
  )
    return
  menus.splice(idx, 1)
  refreshDropdownCategories()
}

// Atualiza JSON visual + textarea bruto
function updateJson () {
  const finalJson = JSON.stringify({ menus }, null, 2)
  jsonOutput.value = finalJson
  editor.value = finalJson // mantém editor raw sempre sincronizado
}

//Ao mudar categoria
categorySelect.addEventListener('change', () =>
  onCategoryChange(categorySelect)
)

categoryNameEdit.addEventListener('change', () =>
  onCategoryChange(categoryNameEdit)
)

categorySelectToEdit.addEventListener('change', () =>
  onCategoryChange(categorySelectToEdit)
)

function onCategoryChange (sourceSelect) {
  const value = sourceSelect.value

  if (sourceSelect === categorySelect) {
    categoryNameEdit.value = value
    categorySelectToEdit.value = value
  } else if (sourceSelect === categoryNameEdit) {
    categorySelect.value = value
    categorySelectToEdit.value = value
  } else {
    categorySelect.value = value
    categoryNameEdit.value = value
  }

  refreshItems()
  updateJson()
}

// ===============================
// CRUD DE ITENS
// ===============================

// Atualiza lista visual e combo de seleção
function refreshItems () {
  const idx = document.getElementById('categorySelect').value
  const ul = document.getElementById('itemsList')
  const itemSelect = document.getElementById('itemSelect')

  ul.innerHTML = ''
  itemSelect.innerHTML = ''

  const itens = menus[idx]?.itens || []

  itens.forEach((item, index) => {
    // Lista visual
    const li = document.createElement('li')
    li.textContent = `${item.label} ${
      item.price ? ' - ' + item.price + ' €' : ''
    }`
    ul.appendChild(li)

    // Dropdown
    const opt = document.createElement('option')
    opt.value = index
    opt.textContent = item.label
    itemSelect.appendChild(opt)
  })

  if (itens.length > 0) {
    itemSelect.value = 0 // seleciona automaticamente o 1º item
    fillItemForm() // <-- preenche os inputs!
  } else {
    clearItemForm() // caso não existam items
  }

  updateJson()
}

function createMenuItem ({ name, desc, price, byOrder, novo, active }) {
  return {
    label: name,
    description: desc,
    urlImagem: './images/default.png',
    price,
    ativo: active,
    novo: Number(novo),
    porEncomenda: Number(byOrder)
  }
}

// ➕ Adicionar item
function addItem () {
  const idx = document.getElementById('categorySelectToEdit').value
  const name = document.getElementById('itemName').value.trim()
  const desc = document.getElementById('itemDesc').value.trim()
  const price = document.getElementById('itemPrice').value.trim()
  const byOrder = document.getElementById('itemOrder').checked
  const novo = document.getElementById('itemNew').checked
  const active = document.getElementById('isActive').checked

  if (!name) return alert('Insira o nome do item.')

  menus[idx].itens.push(
    createMenuItem({ name, desc, price, byOrder, novo, active })
  )

  refreshItems()
}

// ✏ Editar item existente
function editItem () {
  const cIdx = document.getElementById('categorySelectToEdit').value
  const iIdx = document.getElementById('itemSelect').value

  const name = document.getElementById('itemName').value.trim()
  const desc = document.getElementById('itemDesc').value.trim()
  const price = document.getElementById('itemPrice').value.trim()
  const byOrder = document.getElementById('itemOrder').checked
  const novo = document.getElementById('itemNew').checked
  const active = document.getElementById('isActive').checked

  menus[cIdx].itens[iIdx] = createMenuItem({
    name,
    desc,
    price,
    byOrder,
    novo,
    active
  })

  refreshItems()
}

// ❌ Remover item
function removeItem () {
  const cIdx = document.getElementById('categorySelectToEdit').value
  const iIdx = document.getElementById('itemSelect').value

  if (!confirm('Tem certeza que quer remover este item?')) return

  menus[cIdx].itens.splice(iIdx, 1)
  refreshItems()
}

document.getElementById('itemSelect').addEventListener('change', fillItemForm)

function fillItemForm () {
  const cIdx = parseInt(document.getElementById('categorySelect').value, 10)
  const iIdx = parseInt(document.getElementById('itemSelect').value, 10)
  const item = menus[cIdx]?.itens?.[iIdx]

  if (!item) {
    clearItemForm()
    return
  }

  document.getElementById('itemName').value = item.label || ''
  document.getElementById('itemDesc').value = item.description || ''
  document.getElementById('itemPrice').value = item.price || ''
  document.getElementById('itemOrder').checked = item.porEncomenda
  document.getElementById('itemNew').checked = item.novo
  document.getElementById('isActive').checked = item.ativo
}

function clearItemForm () {
  document.getElementById('itemName').value = ''
  document.getElementById('itemDesc').value = ''
  document.getElementById('itemPrice').value = ''
  document.getElementById('itemOrder').checked = false
  document.getElementById('itemNew').checked = false
  document.getElementById('isActive').checked = false
}
