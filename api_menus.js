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
          description: 'Refrigerante gelado',
          preco: 2.5,
          urlImagem: IMG_BASE + 'coca-cola.png',
          ativo: true
        },
        {
          label: 'Suco de Laranja',
          description: 'Suco natural fresco',
          preco: 3.0,
          urlImagem: IMG_BASE + 'suco-laranja.jpg',
          ativo: true
        },
        {
          label: 'Água Mineral',
          description: 'Água pura e refrescante',
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
          description: 'Delicioso pudim caseiro',
          preco: 4.0,
          urlImagem: IMG_BASE + 'pudim.jpg',
          ativo: true
        },
        {
          label: 'Mousse de Chocolate',
          description: 'Delicioso sabor de chocolate',
          preco: 4.5,
          urlImagem: IMG_BASE + 'mousse.jpg',
          ativo: true
        },
        {
          label: 'Mousse de Baunilha',
          description: 'Delicioso sabor de baunilha',
          preco: 4.5,
          urlImagem: IMG_BASE + 'mousse.jpg',
          ativo: true
        }
      ]
    },
    {
      label: 'Saladas',
      id: 'saladas',
      itens: [
        {
          label: 'Salada Caesar',
          description: 'Com frango grelhado',
          preco: 3.5,
          urlImagem: IMG_BASE + 'coca-cola.png',
          ativo: true
        },
        {
          label: 'Salada Grega',
          description: 'Com queijo feta',
          preco: 3.0,
          urlImagem: IMG_BASE + 'suco-laranja.jpg',
          ativo: true
        },
        {
          label: 'Salada de Frutas',
          description: 'Fresca e saudável',
          preco: 1.5,
          urlImagem: IMG_BASE + 'agua.jpg',
          ativo: true
        }
      ]
    }
  ]
}
