import type { NextApiRequest, NextApiResponse } from 'next'
import { getPostById, updatePost, deletePost, getUserById } from '../../../../lib/store'
import { getTokenFromReq, verifyToken } from '../../../../lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[${req.method}] /api/v1/posts/[id] - incoming`)
  const { id } = req.query
  const postId = Number(id)
  if (Number.isNaN(postId)) return res.status(400).json({ error: 'Invalid id' })

  if (req.method === 'GET') {
    const post = await getPostById(postId)
    if (!post) return res.status(404).json({ error: 'Not found' })
    const author = await getUserById(post.authorId)
    return res.json({ ...post, author: author ? { id: author.id, username: author.username, email: author.email } : null })
  }

  if (req.method === 'PUT') {
    const token = getTokenFromReq(req)
    const user = token ? (verifyToken(token) as any) : null
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const existing = await getPostById(postId)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    if (existing.authorId !== user.id) return res.status(403).json({ error: 'Forbidden' })

    const { content } = req.body
    const updated = await updatePost(postId, { content })
    return res.json(updated)
  }

  if (req.method === 'DELETE') {
    const token = getTokenFromReq(req)
    const user = token ? (verifyToken(token) as any) : null
    if (!user) return res.status(401).json({ error: 'Unauthorized' })

    const existing = await getPostById(postId)
    if (!existing) return res.status(404).json({ error: 'Not found' })
    if (existing.authorId !== user.id) return res.status(403).json({ error: 'Forbidden' })

    const ok = await deletePost(postId)
    if (!ok) return res.status(500).json({ error: 'Failed to delete' })
    console.log('[DELETE] /api/v1/posts/[id] - deleted', postId)
    return res.status(204).end()
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
