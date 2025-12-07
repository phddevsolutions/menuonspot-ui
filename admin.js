// 🔧 CONFIGURAÇÃO
const OWNER = 'phddevsolutions'
const REPO = 'menuonspot-ui'
const BRANCH = 'main'
const FILE_PATH = 'data.json'
const WORKFLOW_FILE = 'update-data.yml'
const TOKEN_PROXY = 'https://vercel-git-proxy.vercel.app/api/token'
const CLIENT_ID = 'Ov23lieOlxeI1P0NX5ha'

const loginBtn = document.getElementById('loginBtn')
const loadBtn = document.getElementById('loadBtn')
const saveBtn = document.getElementById('saveBtn')
const editor = document.getElementById('editor')

let accessToken = null

// 🔹 Login GitHub
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
      loadBtn.style.display = 'inline-block'
      history.replaceState({}, document.title, window.location.pathname)
    })
    .catch(err => {
      console.error(err)
      alert('Erro ao obter token do GitHub')
    })
}

// 🔹 Carregar data.json
loadBtn.onclick = async () => {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    )
    const data = await res.json()
    const content = atob(data.content.replace(/\n/g, ''))
    editor.value = content
    editor.style.display = 'block'
    saveBtn.style.display = 'inline-block'
  } catch (err) {
    console.error(err)
    alert('Erro ao carregar data.json')
  }
}

// 🔹 Guardar alterações via workflow_dispatch
saveBtn.onclick = async () => {
  const newContent = editor.value // deve ser JSON como string

  try {
    const workflowUrl = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`
    const response = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json'
      },
      body: JSON.stringify({
        ref: BRANCH, // ex: "main"
        inputs: { content: newContent } // já é string
      })
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`GitHub API error: ${response.status} ${text}`)
    }

    alert('Alterações enviadas com sucesso')
  } catch (err) {
    console.error(err)
    alert(
      'Erro ao enviar alterações para o workflow. Veja console para detalhes.'
    )
  }
}
