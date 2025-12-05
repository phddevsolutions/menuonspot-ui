// 🔧 CONFIGURAR ESTES CAMPOS:
const CLIENT_ID = 'Ov23lieOlxeI1P0NX5ha'
const OWNER = 'phddevsolutions'
const REPO = 'menuonspot-ui'
const FILE_PATH = 'data.json'

// Proxy OAuth (open-source)
const TOKEN_PROXY = 'https://github-oauth-proxy.vercel.app/api/token'

const params = new URLSearchParams(window.location.search)
const code = params.get('code')

let accessToken = null

document.getElementById('loginBtn').onclick = () => {
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo`
  window.location.href = url
}

// Se o GitHub devolveu "code", trocar por token temporário:
if (code) {
  fetch(TOKEN_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, client_id: CLIENT_ID })
  })
    .then(r => r.json())
    .then(data => {
      accessToken = data.access_token
      document.getElementById('loginBtn').style.display = 'none'
      document.getElementById('loadBtn').style.display = 'inline-block'
      history.replaceState({}, document.title, window.location.pathname)
    })
}

document.getElementById('loadBtn').onclick = async () => {
  const r = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )

  const json = await r.json()
  window._sha = json.sha

  const content = atob(json.content) // base64 → texto
  document.getElementById('editor').value = content

  document.getElementById('editor').style.display = 'block'
  document.getElementById('saveBtn').style.display = 'inline-block'
}

document.getElementById('saveBtn').onclick = async () => {
  const newContent = document.getElementById('editor').value

  await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update data.json',
        content: btoa(newContent),
        sha: window._sha
      })
    }
  )

  alert('Guardado com sucesso!')
}
