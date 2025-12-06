export default async function handler (req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*') // ou apenas teu domínio em vez de '*'
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Respondendo a preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido 2' })
  }

  try {
    const { code, client_id } = req.body
    if (!code || !client_id) {
      return res.status(400).json({ error: 'Faltando code ou client_id' })
    }

    const client_secret = process.env.GITHUB_CLIENT_SECRET

    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ client_id, client_secret, code })
      }
    )

    const data = await response.json()

    if (data.error) {
      return res
        .status(400)
        .json({ error: data.error_description || data.error })
    }

    res.status(200).json({ access_token: data.access_token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno no proxy' })
  }
}
