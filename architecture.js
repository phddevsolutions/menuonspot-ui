function buildArchitecture (callback) {
  const tasks = []

  // Header
  tasks.push(
    fetch('header.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('header-placeholder').innerHTML = data
      })
      .catch(err => console.error('Erro ao carregar header.html', err))
  )

  // Index section

  tasks.push(
    fetch('index-section.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('index-section-placeholder').innerHTML = data

        loadLanguage(getLanguage())
      })
      .catch(err => console.error('Erro ao carregar index-section.html', err))
  )

  // Footer
  tasks.push(
    fetch('footer.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data
      })
      .catch(err => console.error('Erro ao carregar footer.html', err))
  )

  // Espera por todas as tarefas
  Promise.all(tasks).then(() => {
    if (typeof callback === 'function') {
      callback()
    }
  })
}
