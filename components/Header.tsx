import React, { useEffect, useState } from 'react'

type Props = {
  onOpenLogin: () => void
  onOpenRegister: () => void
}

export default function Header({ onOpenLogin, onOpenRegister }: Props) {
  const [username, setUsername] = useState<string>('Aman')
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    // read from localStorage on mount and when storage changes
    const read = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const name = typeof window !== 'undefined' ? localStorage.getItem('username') : null
      setLoggedIn(!!token)
      setUsername(name || 'Aman')
    }

    read()

    // simple storage event listener so other tabs update header
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'username') read()
    }
    const onAuthChange = () => read()
    window.addEventListener('storage', onStorage)
    window.addEventListener('auth-change', onAuthChange)
    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('auth-change', onAuthChange)
    }
  }, [])

  function handleLogout() {
    console.log('[Header] logout')
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setLoggedIn(false)
    setUsername('Aman')
    // trigger storage event for same-tab listeners
    try {
      window.dispatchEvent(new StorageEvent('storage', { key: 'token', newValue: null }))
    } catch (e) {
      // some browsers don't allow constructing StorageEvent; ignore
    }
  }

  return (
    <header className="bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Hello {username}</h1>
          <p className="text-gray-400 text-sm">
            How are you doing today? Would you like to share something with the community 👋
          </p>
        </div>
        <div className="flex gap-3 mt-1">
          {!loggedIn ? (
            <>
              <button
                onClick={onOpenLogin}
                className="text-gray-400 hover:text-white text-sm"
              >
                Login
              </button>
              <button
                onClick={onOpenRegister}
                className="text-gray-400 hover:text-white text-sm"
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-400 text-sm">Signed in</span>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-white text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
