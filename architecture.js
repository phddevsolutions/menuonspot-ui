async function buildArchitecture (callback) {
  try {
    const headerRes = await fetch('header.html')
    document.getElementById('header-placeholder').innerHTML =
      await headerRes.text()

    if (typeof buildHeader === 'function') {
      buildHeader()
    }

    const sectionRes = await fetch('index-section.html')
    document.getElementById('index-section-placeholder').innerHTML =
      await sectionRes.text()

    // 3️⃣ Now load nested sections (they exist now)
    const [menuRes] = await Promise.all([
      // fetch('filter-section.html'),
      fetch('menu-section.html')
      // fetch('company-section.html')
    ])

    // document.getElementById('filter-placeholder').innerHTML =
    //   await filterRes.text()
    document.getElementById('menu-placeholder').innerHTML = await menuRes.text()
    // document.getElementById('company-placeholder').innerHTML =
    //   await companyRes.text()

    if (typeof buildMenuSections === 'function') {
      buildMenuSections('menu-placeholder')
    }

    const footerRes = await fetch('footer.html')
    document.getElementById('footer-placeholder').innerHTML =
      await footerRes.text()

    // 5️⃣ Load languages after all content is inserted
    if (typeof loadLanguage === 'function') {
      loadLanguage(getLanguage())
    }

    // 6️⃣ Callback
    if (typeof callback === 'function') callback()
  } catch (err) {
    console.error('Error building architecture:', err)
  }
}
