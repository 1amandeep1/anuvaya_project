import React, { useState } from 'react'

type Props = {
  onPosted?: () => void
  onRequireLogin?: () => void
}

export default function CreatePost({ onPosted, onRequireLogin }: Props) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handlePost() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      onRequireLogin && onRequireLogin()
      return
    }

    if (!text.trim()) return

    setLoading(true)
    const res = await fetch('/api/v1/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: text })
    })

    setLoading(false)
    if (res.ok) {
      setText('')
      onPosted && onPosted()
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-4">
      <h2 className="text-white text-lg font-medium mb-4">Create post</h2>
      <div className="flex items-start gap-3 bg-gray-900 rounded-lg p-4 mb-4">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-sm">💬</span>
        </div>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="How are you feeling today?"
          className="flex-1 bg-transparent text-gray-400 outline-none"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handlePost}
          disabled={loading || !text.trim()}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white px-6 py-2 rounded-lg text-sm font-medium"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}
