import React from 'react'

export default function PostCard({ post, onDeleted }: any) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  async function handleDelete() {
    if (!token) return
    const res = await fetch(`/api/v1/posts/${post.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.status === 204 && onDeleted) onDeleted()
  }

  const timeAgo = () => {
    const mins = Math.floor((Date.now() - new Date(post.createdAt).getTime()) / 60000)
    if (mins < 60) return `${mins}mins ago`
    const hours = Math.floor(mins / 60)
    return `${hours}h ago`
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full" />
          <div>
            <h3 className="text-white font-medium">{post.author.username}</h3>
            <p className="text-gray-400 text-xs">
              {timeAgo()} {post.edited && '• Edited'}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
          <span className="text-xl">⋮</span>
        </button>
      </div>

      <div className="flex items-start gap-3 bg-gray-900 rounded-lg p-4 mb-3">
        <span className="text-xl">👋</span>
        <p className="text-gray-300 text-sm flex-1">{post.content}</p>
      </div>

      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-gray-400 text-sm">
          <span>💬</span>
          <span>{post.commentsCount} comments</span>
        </button>
        {token && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-400 text-sm"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
