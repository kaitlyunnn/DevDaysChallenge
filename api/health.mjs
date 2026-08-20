export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    env: {
      supabase: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      gemini: Boolean(process.env.GEMINI_API_KEY),
    },
  })
}
