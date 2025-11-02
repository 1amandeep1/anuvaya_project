import type { NextApiRequest, NextApiResponse } from 'next'
import { findUserByIdentifier } from '../../../../lib/store'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[POST] /api/v1/auth/login - incoming')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { identifier, password } = req.body
  if (!identifier || !password) return res.status(400).json({ error: 'Missing fields' })

  const user = await findUserByIdentifier(identifier)
  if (!user) {
    console.log('[POST] /api/v1/auth/login - user not found', identifier)
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    console.log('[POST] /api/v1/auth/login - invalid password for user', user.id)
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  const token = signToken({ id: user.id, username: user.username })
  console.log('[POST] /api/v1/auth/login - success', user.id)
  return res.json({ user: { id: user.id, email: user.email, username: user.username }, token })
}
