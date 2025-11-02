import React, { useState } from 'react'
import useSWR, { mutate } from 'swr'
import Header from '../components/Header'
import CreatePost from '../components/CreatePost'
import PostCard from '../components/PostCard'
import LoginModal from '../components/LoginModal'
import RegisterModal from '../components/RegisterModal'

const fetcher = (url: string) => fetch(url).then(r => r.json())

// Main App Component
export default function Home() {
  const { data: posts = [] } = useSWR('/api/v1/posts', fetcher, {
    // fetch once on mount and don't revalidate on focus/reconnect by default
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0
  })
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        onOpenLogin={() => setShowLogin(true)}
        onOpenRegister={() => setShowRegister(true)}
      />

      <main className="max-w-3xl mx-auto p-6">
        <CreatePost
          onPosted={() => mutate('/api/v1/posts')}
          onRequireLogin={() => setShowLogin(true)}
        />

        <div>
          {posts.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No posts yet — be the first to post!
            </p>
          ) : (
            posts.map((post: any) => (
              <PostCard
                key={post.id}
                post={post}
                onDeleted={() => mutate('/api/v1/posts')}
              />
            ))
          )}
        </div>
      </main>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitch={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitch={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
        />
      )}
    </div>
  )
}