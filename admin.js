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
const addCategoryBtn = document.getElementById('addCategoryId')
const editCategoryBtn = document.getElementById('editCategoryId')
const removeCategoryBtn = document.getElementById('removeCategoryId')

const saveProductBtn = document.getElementById('saveProductId')
const deleteProductBtn = document.getElementById('deleteProductId')

const saveBtn = document.getElementById('saveBtn')
const editor = document.getElementById('editor')

const spinner = document.getElementById('imageSpinner')

const menuEditor = document.getElementById('menuEditor')
const menuItens = document.getElementById('menuItens')
const navbuttons = document.getElementById('navbuttons')
const menuComplete = document.getElementById('menuComplete')
const mainTab = document.getElementById('pills-home')
const jsonOutput = document.getElementById('jsonOutput')
let loading = false
const urldefaultpath = './images/default.png'
let accessToken = null
let menus = [] // ← dados manipulados no editor visual
let currentImageLoadToken = 0
let temp_newProduct = false

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
  EnableSpinner(loginBtn)
  fetch(TOKEN_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, client_id: CLIENT_ID })
  })
    .then(r => r.json())
    .then(data => {
      accessToken = data.access_token
      history.replaceState({}, document.title, window.location.pathname)
      carregarDataJson()
      loginBtn.style.display = 'none'
    })
    .catch(err => {
      DisableSpinner(loginBtn)
      console.error(err)
      showToast('Erro ao obter token!', 'danger')
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

    // Preenche editor visual
    const parsed = JSON.parse(content)
    menus = parsed.menus
    // menuEditor.style.display = 'block'
    // menuItens.style.display = 'block'
    mainTab.classList.add('show', 'active')

    navbuttons.style.display = 'block'
    // menuComplete.style.display = 'block'
    loading = true
    refreshDropdownCategories()
    loading = false
  } catch (err) {
    console.error(err)
    showToast('Erro ao carregar dados!', 'danger')
  }
}

async function saveContent () {
  try {
    const rawContent = editor.value
    const jsonObj = JSON.parse(rawContent)
    const newContent = JSON.stringify(jsonObj)

    if (newContent.length === 0) {
      throw new Error('Menu vazio contactar o suporte!')
    }

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
      throw new Error(`GitHub API error: ${response.status} - ${text}`)
    }

    showToast('Alterações enviadas com sucesso!', 'success')
  } catch (err) {
    showToast(err.message ?? err, 'danger')
  }
}

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

async function addCategory () {
  EnableSpinner(addCategoryBtn)
  const nameInput = document.getElementById('categoryName')
  const name = nameInput.value.trim()
  if (!name) {
    DisableSpinner(addCategoryBtn)
    return showToast('Nova categoria vazia!', 'warning')
  }

  const exists = menus.some(m => m.label.toLowerCase() === name.toLowerCase())

  if (!exists) {
    menus.push({
      label: name,
      id: name.toLowerCase().replace(/\s+/g, '_'),
      itens: []
    })

    menus.sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    )
    refreshDropdownCategories()
    await showSave()
  }

  nameInput.value = ''
  DisableSpinner(addCategoryBtn)
}

async function editCategory () {
  EnableSpinner(editCategoryBtn)
  const idx = document.getElementById('categoryNameEdit').value
  const nameInput = document.getElementById('categoryNameEditText')
  const name = nameInput.value.trim()
  if (!name) {
    DisableSpinner(editCategoryBtn)
    return showToast('Nome da categoria vazia!', 'warning')
  }

  menus[idx].label = name
  menus[idx].id = name.replace(/\s+/g, '_')

  refreshDropdownCategories()
  await showSave()
  nameInput.value = ''
  DisableSpinner(editCategoryBtn)
}

async function removeCategory () {
  EnableSpinner(removeCategoryBtn)
  const idx = document.getElementById('categorySelect').value
  if (
    !confirm('A categoria e todos os items serão eliminados, Tem a certeza ?')
  ) {
    DisableSpinner(removeCategoryBtn)
    return
  }

  menus.splice(idx, 1)
  refreshDropdownCategories()
  await showSave()
  DisableSpinner(removeCategoryBtn)
}

// Atualiza JSON visual + textarea bruto
function updateJson () {
  const finalJson = JSON.stringify({ menus }, null, 2)
  // jsonOutput.value = finalJson
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
  setSaveButtonEnabled(false)
  loading = true
  refreshItems()
  loading = false
  updateJson()
}

// ===============================
// CRUD DE ITENS
// ===============================

// Atualiza lista visual e combo de seleção
function refreshItems () {
  setSaveButtonEnabled(false)
  const idx = document.getElementById('categorySelect').value
  const ul = document.getElementById('itemsList')
  const itemSelect = document.getElementById('itemSelect')
  let currentItemIndex = itemSelect.value ?? null

  ul.innerHTML = ''
  itemSelect.innerHTML = ''

  const itens = menus[idx]?.itens || []

  itens.forEach((item, index) => {
    // Lista visual
    const li = document.createElement('li')
    li.textContent = `${item.label} ${
      item.preco ? ' - ' + item.preco + ' €' : ''
    }`
    ul.appendChild(li)

    // Dropdown
    const opt = document.createElement('option')
    opt.value = index
    opt.textContent = item.label
    itemSelect.appendChild(opt)
  })

  if (itens.length > 0) {
    if (currentItemIndex !== null && itens[currentItemIndex]) {
      itemSelect.value = currentItemIndex
    }
    if (loading) {
      itemSelect.value = 0
    }
    if (temp_newProduct) {
      itemSelect.value = itens.length - 1
      temp_newProduct = false
    }
    fillItemForm()
  } else {
    clearItemForm() // caso não existam items
  }

  updateJson()
}
// function refreshItems () {
//   const idx = parseInt(document.getElementById('categorySelect').value, 10)
//   const ul = document.getElementById('itemsList')
//   const itemSelect = document.getElementById('itemSelect')

//   ul.innerHTML = ''
//   itemSelect.innerHTML = ''

//   const itens = menus[idx]?.itens || []

//   itens.forEach((item, index) => {
//     // Lista visual
//     const li = document.createElement('li')
//     li.textContent = `${item.label} – ${item.description} ${
//       item.preco ? ' (€' + item.preco + ')' : ''
//     }`

//     li.addEventListener('click', () => {
//       itemSelect.value = index
//       fillItemForm()
//     })
//     ul.appendChild(li)

//     const opt = document.createElement('option')
//     opt.value = index
//     opt.textContent = item.label
//     itemSelect.appendChild(opt)
//   })

//   if (itens.length > 0) {
//     if (loading) {
//       itemSelect.value = 0
//     }
//     fillItemForm()
//   } else {
//     clearItemForm()
//   }

//   updateJson()
// }

function createMenuItem ({
  name,
  desc,
  price,
  byOrder,
  novo,
  active,
  urlImagem
}) {
  return {
    label: name,
    description: desc,
    urlImagem: urlImagem || urldefaultpath,
    preco: price,
    ativo: active,
    novo: Number(novo),
    porEncomenda: Number(byOrder)
  }
}

async function processItem () {
  EnableSpinner(saveProductBtn)
  const cIdx = document.getElementById('categorySelectToEdit').value
  const name = document.getElementById('itemName').value.trim()
  const desc = document.getElementById('itemDesc').value.trim()
  const price = document.getElementById('itemPrice').value.trim()
  const byOrder = document.getElementById('itemOrder').checked
  const novo = document.getElementById('itemNew').checked
  const active = document.getElementById('isActive').checked

  if (!name) {
    DisableSpinner(saveProductBtn)
    return showToast('Nome vazio', 'danger')
  }
  if (!price) {
    DisableSpinner(saveProductBtn)
    return showToast('Preco vazio', 'danger')
  }

  let urlImagem = urldefaultpath

  if (selectedImageFile) {
    urlImagem = await uploadImageToRepo(selectedImageFile)
    selectedImageFile = null
  }

  const newItem = createMenuItem({
    name,
    desc,
    price,
    byOrder,
    novo,
    active,
    urlImagem
  })

  const itens = menus[cIdx]?.itens

  const labelExists =
    Array.isArray(itens) &&
    itens.some(item => item.label.toLowerCase() === name.toLowerCase())

  if (labelExists) {
    const iIdx = document.getElementById('itemSelect').value
    menus[cIdx].itens[iIdx] = newItem
  } else {
    menus[cIdx].itens.push(newItem)
    temp_newProduct = true
  }

  refreshItems()
  await showSave()
  DisableSpinner(saveProductBtn)
}

// ➕ Adicionar item
function addItem (cIdx, name, desc, price, byOrder, novo, active, image) {
  menus[cIdx].itens.push(
    createMenuItem({ name, desc, price, byOrder, novo, active, image })
  )
}

// ✏ Editar item existente
function editItem (cIdx, name, desc, price, byOrder, novo, active, image) {
  const iIdx = document.getElementById('itemSelect').value

  menus[cIdx].itens[iIdx] = createMenuItem({
    name,
    desc,
    price,
    byOrder,
    novo,
    active,
    image
  })
}

async function removeItem () {
  EnableSpinner(deleteProductBtn)
  const cIdx = document.getElementById('categorySelectToEdit').value
  const iIdx = document.getElementById('itemSelect').value

  if (!confirm('Tem certeza que quer remover este item?')) {
    DisableSpinner(deleteProductBtn)
    return
  }
  menus[cIdx].itens.splice(iIdx, 1)
  refreshItems()
  await showSave()
  DisableSpinner(deleteProductBtn)
}

document.getElementById('itemSelect').addEventListener('change', fillItemForm)

document.addEventListener('input', e => {
  if (e.target.matches('.save-trigger')) {
    setSaveButtonEnabled(true)
  }
})

document.addEventListener('change', e => {
  if (e.target.matches('.save-trigger')) {
    setSaveButtonEnabled(true)
  }
})

function fillItemForm () {
  setSaveButtonEnabled(false)
  selectedImageFile = null
  const cIdx = parseInt(document.getElementById('categorySelect').value, 10)
  const iIdx = parseInt(document.getElementById('itemSelect').value, 10)
  const item = menus[cIdx]?.itens?.[iIdx]

  if (!item) {
    clearItemForm()
    return
  }

  document.getElementById('itemName').value = item.label || ''
  document.getElementById('itemDesc').value = item.description || ''
  document.getElementById('itemPrice').value = item.preco || ''
  document.getElementById('itemOrder').checked = item.porEncomenda
  document.getElementById('itemNew').checked = item.novo
  document.getElementById('isActive').checked = item.ativo

  const preview = document.getElementById('preview')
  const urlImagem = item.urlImagem || urldefaultpath

  preview.src = ''
  spinner.style.setProperty('display', 'block', 'important')

  const token = ++currentImageLoadToken
  loadImageWithRetry(urlImagem, 15, 5000, token)
    .then(url => {
      if (token === currentImageLoadToken) {
        preview.src = url
      }
    })
    .catch(() => {
      if (token === currentImageLoadToken) {
        preview.src = urldefaultpath
      }
    })
    .finally(() => {
      if (token === currentImageLoadToken) {
        spinner.style.setProperty('display', 'none', 'important')
      }
    })
}

function loadImageWithRetry (url, retries, delay, token) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    let attempts = 0

    const tryLoad = () => {
      if (token !== currentImageLoadToken) {
        reject('Cancelled')
        return
      }
      img.src = `${url}?cb=${Date.now()}`
    }

    img.onload = () => resolve(img.src)
    img.onerror = () => {
      if (token !== currentImageLoadToken) {
        reject('Cancelled')
        return
      }
      if (++attempts >= retries) reject()
      else setTimeout(tryLoad, delay)
    }

    tryLoad()
  })
}

function setSaveButtonEnabled (enabled) {
  saveProductBtn.disabled = !enabled
  saveProductBtn.setAttribute('aria-disabled', String(!enabled))
  saveProductBtn.classList.toggle('btn-primary', enabled)
  saveProductBtn.classList.toggle('btn-secondary', !enabled)
}

// async function loadImageWithRetry (url, maxRetries = 5, delayMs = 50000) {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       const res = await fetch(url, { method: 'HEAD' })
//       if (res.ok) return url // image exists
//     } catch (e) {
//       // ignore fetch errors
//     }
//     await new Promise(r => setTimeout(r, delayMs))
//   }
//   throw new Error('Image not available')
// }

function clearItemForm () {
  selectedImageFile = null
  document.getElementById('itemName').value = ''
  document.getElementById('itemDesc').value = ''
  document.getElementById('itemPrice').value = ''
  document.getElementById('itemOrder').checked = false
  document.getElementById('itemNew').checked = false
  document.getElementById('isActive').checked = false
  document.getElementById('preview').src = ''
}

async function showSave () {
  await saveContent()
  //showToast('Não esquecer de: Enviar Alterações', 'info')
  //const sendDataContainer = document.getElementById('sendDataContainer')
  //sendDataContainer.style.display = 'block'
}

function EnableSpinner (button) {
  if (!button) return
  button.classList.add('btn-loading')
  button.disabled = true
}

function DisableSpinner (button) {
  if (!button) return
  button.classList.remove('btn-loading')
  button.disabled = false
}

function showToast (message, type = 'success') {
  const toastEl = document.getElementById('appToast')
  const toastMsg = document.getElementById('toastMessage')

  toastEl.className = `toast align-items-center text-bg-${type} border-0`
  toastMsg.textContent = message
  let delay
  switch (type) {
    case 'success':
      delay = 2000
      break
    case 'danger':
      delay = 10000
      break
    case 'warning':
      delay = 3000
      break
    case 'info':
      delay = 4000
      break
    default:
      delay = 3000
  }

  const toast = new bootstrap.Toast(toastEl, { delay: 2000 })
  toast.show()
}

let selectedImageFile = null
document.getElementById('imageUpload').addEventListener('change', e => {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showToast('Invalid image type', 'danger')
    e.target.value = ''
    return
  }
  if (file.size > 2_000_000) {
    // optional limit
    showToast('Image too large (max 2MB)', 'danger')
    e.target.value = ''
    return
  }
  setSaveButtonEnabled(true)
  selectedImageFile = file
  document.getElementById('preview').src = URL.createObjectURL(file)
})

function fileToBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function uploadImageToRepo (file) {
  const imageName = `${crypto.randomUUID()}-${file.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.-]/g, '')}`
  const path = `images/docesobreamesa/${imageName}`
  const content = await fileToBase64(file)

  const response = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Upload image ${file.name}`,
        content,
        branch: BRANCH
      })
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Image upload failed: ${text}`)
  }

  return `./${path}` // relative path to store in JSON
}

function RemoveImage () {
  const cIdx = document.getElementById('categorySelectToEdit').value
  const itens = menus[cIdx]?.itens
  const name = document.getElementById('itemName').value.trim()

  const labelExists =
    Array.isArray(itens) &&
    itens.some(item => item.label.toLowerCase() === name.toLowerCase())

  if (labelExists) {
    const input = document.getElementById('imageUpload')
    input.value = ''
    const preview = document.getElementById('preview')
    preview.src = urldefaultpath
    preview.title = ''

    // const iIdx = document.getElementById('itemSelect').value
    // menus[cIdx].itens[iIdx].urlImagem = urldefaultpath

    setSaveButtonEnabled(true)
    selectedImageFile = null
  }
}
