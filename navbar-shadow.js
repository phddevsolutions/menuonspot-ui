function updateNavbarShadows () {
  const nav = document.querySelector('.navbar')
  const left = document.querySelector('.shadow-left')
  const right = document.querySelector('.shadow-right')

  if (!nav) return

  left.style.display = nav.scrollLeft > 5 ? 'block' : 'none'
  right.style.display =
    nav.scrollWidth - nav.clientWidth - nav.scrollLeft > 5 ? 'block' : 'none'
}

document.addEventListener('scroll', updateNavbarShadows, true)
