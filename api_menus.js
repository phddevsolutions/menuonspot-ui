const IMG_BASE = '/images/'
const DEFAULT_IMG = IMG_BASE + 'default.png'

const data = {
  menus: [
    {
      label: 'Bebidas',
      id: 'bebidas',
      itens: [
        {
          label: 'Coca-Cola',
          preco: 2.5,
          urlImagem: IMG_BASE + 'coca-cola.png',
          ativo: true
        },
        {
          label: 'Suco de Laranja',
          preco: 3.0,
          urlImagem: IMG_BASE + 'suco-laranja.jpg',
          ativo: true
        },
        {
          label: 'Água Mineral',
          preco: 1.5,
          urlImagem: IMG_BASE + 'agua.jpg',
          ativo: true
        }
      ]
    },
    {
      label: 'Sobremesas',
      id: 'sobremesas',
      itens: [
        {
          label: 'Pudim',
          preco: 4.0,
          urlImagem: IMG_BASE + 'pudim.jpg',
          ativo: true
        },
        {
          label: 'Mousse de Chocolate',
          preco: 4.5,
          urlImagem: IMG_BASE + 'mousse.jpg',
          ativo: true
        },
        {
          label: 'Mousse de Baunilha',
          preco: 4.5,
          urlImagem: IMG_BASE + 'mousse.jpg',
          ativo: true
        }
      ]
    }
  ]
}
