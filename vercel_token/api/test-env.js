export default function handler(req, res) {
  res.json({
    id: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_CLIENT_SECRET ? "OK" : "MISSING"
  });
}