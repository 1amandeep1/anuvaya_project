import type { NextApiRequest, NextApiResponse } from 'next'
import { getTokenFromReq, verifyToken } from '../../../../lib/auth'
import { createPost, getPosts, getUserById } from '../../../../lib/store'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[${req.method}] /api/v1/posts - incoming`)
  if (req.method === 'GET') {
    const posts = await getPosts()
    // attach author info
    const postsWithAuthor = await Promise.all(posts.map(async (p) => {
      const author = await getUserById(p.authorId)
      return { ...p, author: author ? { id: author.id, username: author.username, email: author.email } : null }
    }))
    return res.json(postsWithAuthor)
  }

  if (req.method === 'POST') {
    const token = getTokenFromReq(req)
    const user = token ? (verifyToken(token) as any) : null
    if (!user) {
      console.log('[POST] /api/v1/posts - unauthorized')
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const { content } = req.body
    if (!content) return res.status(400).json({ error: 'Missing content' })

    const p = await createPost({ content, authorId: user.id })
    const author = await getUserById(p.authorId)
    const created = { ...p, author: author ? { id: author.id, username: author.username, email: author.email } : null }
    console.log('[POST] /api/v1/posts - created', p.id)
    return res.status(201).json(created)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
