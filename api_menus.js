const IMG_BASE = './images/'
const DEFAULT_IMG = IMG_BASE + 'default.png'

const data = {
  menus: [
    {
      label: 'Bebidas',
      id: 'bebidas',
      itens: [
        {
          label: 'Sumo Natural',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Granizado',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Sangria',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Caipirinha',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        }
      ]
    },
    {
      label: 'Tostas',
      id: 'tostas',
      itens: [
        {
          label: 'Mista',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Frango',
          description:
            'Frango, Alface, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Atum',
          description:
            'Atum, Alface, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Camarão',
          description:
            'Camarão, Alface, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Pasta de Frango',
          description:
            'Pasta de Frango, Alface, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Pasta de Atum',
          description:
            'Pasta de Atum, Alface, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Gulosa',
          description:
            'Pão Saloio, Queijo, Alface, Tomate, Bacon Grelhado, Ovo Frito, Molho de Casa',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        }
      ]
    },
    {
      label: 'Saladas',
      id: 'saladas',
      itens: [
        {
          label: 'Frango',
          description:
            'Frango, Alface, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Croutons, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Atum',
          description:
            'Atum, Alface, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Croutons, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Camarão',
          description:
            'Camarão, Alface, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Croutons, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        }
      ]
    },
    {
      label: 'Wraps',
      id: 'wraps',
      itens: [
        {
          label: 'Frango',
          description:
            'Frango, Tortilha, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Croutons, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Atum',
          description:
            'Atum, Tortilha, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Croutons, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Camarão',
          description:
            'Camarão, Tortilha, Rúcula, Tomate Cherry, Cenoura, Mozzarella Fresca, Croutons, Molho Pitta',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        }
      ]
    },
    {
      label: 'Sobremesas',
      id: 'sobremesas',
      itens: [
        {
          label: 'Panacota Frutos Vermelhos',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Mousse Oreo',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Pudim de Ovos',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Pêra Bebada',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Bolo de Bolacha',
          description: '',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Mousse de Caramelo Salgado',
          description:
            'Caramelo Salgado com Morangos e crocante de Bolacha e Chocolate',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Mousse de Lima',
          description: 'Lima com Biscoito de Champagne',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        },
        {
          label: 'Mousse de Ananás',
          description: ' Ananás com cobertura de Ananás caramelisado e Suspiro',
          preco: 0,
          urlImagem: IMG_BASE + 'default.jpg',
          ativo: true,
          novo: 0,
          porEncomenda: 0
        }
      ]
    }
  ]
}
