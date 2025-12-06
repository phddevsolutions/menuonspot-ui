// 🔧 CONFIGURAÇÃO
const OWNER = 'phddevsolutions'
const REPO = 'menuonspot-ui'
const BRANCH = 'main'
const WORKFLOW_FILE = 'update-data.yml'

// Elementos do DOM
const loadBtn = document.getElementById('loadBtn')
const saveBtn = document.getElementById('saveBtn')
const editor = document.getElementById('editor')

let jsonContent = '{}'

// 🔹 Carregar data.json direto do GitHub (público ou via token OAuth se necessário)
loadBtn.onclick = async () => {
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/data.json`
    )
    if (!res.ok) throw new Error('Erro ao carregar data.json')
    const content = await res.text()
    jsonContent = content
    editor.value = content

    editor.style.display = 'block'
    saveBtn.style.display = 'inline-block'
    alert('data.json carregado com sucesso!')
  } catch (err) {
    console.error(err)
    alert('Erro ao carregar data.json')
  }
}

// 🔹 Guardar alterações via workflow_dispatch
saveBtn.onclick = async () => {
  const newContent = editor.value

  try {
    const workflowUrl = `https://api.github.com/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`

    await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json'
        // Não é necessário token aqui, o workflow usará o secret TOKEN_ADMIN
      },
      body: JSON.stringify({
        ref: BRANCH,
        inputs: {
          content: newContent
        }
      })
    })

    alert(
      'Alterações enviadas com sucesso! O workflow fará o commit no repositório.'
    )
  } catch (err) {
    console.error(err)
    alert('Erro ao enviar alterações para o workflow.')
  }
}
