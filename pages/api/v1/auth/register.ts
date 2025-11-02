import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser } from '../../../../lib/store'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('[POST] /api/v1/auth/register - incoming')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, username, password } = req.body
  if (!email || !username || !password) return res.status(400).json({ error: 'Missing fields' })

  // password validation: at least 8 chars and no spaces
  if (typeof password !== 'string' || password.length < 8 || /\s/.test(password)) {
    console.log('[POST] /api/v1/auth/register - weak password')
    return res.status(400).json({ error: 'Password must be at least 8 characters and contain no spaces' })
  }
  try {
    const hashed = await bcrypt.hash(password, 10)
    const user = await createUser({ email, username, password: hashed })
    const token = signToken({ id: user.id, username: user.username })
    console.log('[POST] /api/v1/auth/register - created user', user.id)
    return res.status(201).json({ user: { id: user.id, email: user.email, username: user.username }, token })
  } catch (err: any) {
    console.error('[POST] /api/v1/auth/register - error', err)
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email or username already exists' })
    }
    return res.status(500).json({ error: 'Server error' })
  }
}
