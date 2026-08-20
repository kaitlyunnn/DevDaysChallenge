/**
 * Expo dev serves web on http://localhost:8081, which is a different origin
 * from the deployed functions, so browser requests need CORS. Native apps
 * aren't subject to CORS at all.
 *
 * Returns true when the request was a preflight and has already been answered.
 */
export function applyCors(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return true
  }
  return false
}
