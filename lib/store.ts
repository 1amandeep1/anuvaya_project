import fs from 'fs'
import path from 'path'

const DB_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DB_DIR, 'db.json')

type User = { id: number; email: string; username: string; password: string; createdAt: string }
type Post = { id: number; content: string; createdAt: string; authorId: number; commentsCount: number; edited?: boolean }

async function ensureFolder() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
}

async function readDB(): Promise<{ users: User[]; posts: Post[]; nextUserId: number; nextPostId: number }> {
  await ensureFolder()
  if (!fs.existsSync(DB_FILE)) {
    const init = { users: [], posts: [], nextUserId: 1, nextPostId: 1 }
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2))
    return init
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    // corrupt file: reinitialize
    const init = { users: [], posts: [], nextUserId: 1, nextPostId: 1 }
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2))
    return init
  }
}

async function writeDB(db: { users: User[]; posts: Post[]; nextUserId: number; nextPostId: number }) {
  await ensureFolder()
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

export async function createUser(data: { email: string; username: string; password: string }) {
  const db = await readDB()
  // uniqueness
  if (db.users.find(u => u.email === data.email || u.username === data.username)) {
    const err: any = new Error('Email or username exists')
    err.code = 'P2002'
    throw err
  }
  const user = { id: db.nextUserId++, email: data.email, username: data.username, password: data.password, createdAt: new Date().toISOString() }
  db.users.push(user)
  await writeDB(db)
  return user
}

export async function findUserByIdentifier(identifier: string) {
  const db = await readDB()
  return db.users.find(u => u.email === identifier || u.username === identifier) || null
}

export async function getUserById(id: number) {
  const db = await readDB()
  return db.users.find(u => u.id === id) || null
}

export async function createPost(data: { content: string; authorId: number }) {
  const db = await readDB()
  const post: Post = { id: db.nextPostId++, content: data.content, createdAt: new Date().toISOString(), authorId: data.authorId, commentsCount: 0 }
  db.posts.push(post)
  await writeDB(db)
  return post
}

export async function getPosts() {
  const db = await readDB()
  // return posts ordered desc
  return db.posts.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getPostById(id: number) {
  const db = await readDB()
  return db.posts.find(p => p.id === id) || null
}

export async function updatePost(id: number, data: Partial<Post>) {
  const db = await readDB()
  const idx = db.posts.findIndex(p => p.id === id)
  if (idx === -1) return null
  db.posts[idx] = { ...db.posts[idx], ...data, edited: true }
  await writeDB(db)
  return db.posts[idx]
}

export async function deletePost(id: number) {
  const db = await readDB()
  const idx = db.posts.findIndex(p => p.id === id)
  if (idx === -1) return false
  db.posts.splice(idx, 1)
  await writeDB(db)
  return true
}
