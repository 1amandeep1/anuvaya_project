import jwt from 'jsonwebtoken'
import { NextApiRequest } from 'next'

const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-secure-secret'

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (e) {
    return null
  }
}

export function getTokenFromReq(req: NextApiRequest) {
  const auth = req.headers.authorization
  if (!auth) return null
  const parts = auth.split(' ')
  if (parts.length !== 2) return null
  const [, token] = parts
  return token
}
