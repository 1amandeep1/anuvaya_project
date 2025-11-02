import React, { useState } from 'react'

export default function RegisterModal({ onClose, onSwitch }: any) {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleRegister(e?: React.FormEvent) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password })
    })

    setLoading(false)

    if (res.ok) {
      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.user.username)
      // notify other components in this tab
      try { window.dispatchEvent(new Event('auth-change')) } catch (e) {}
        onClose()
    } else {
      const data = await res.json()
      setError(data.error || 'Registration failed')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <p className="text-gray-400 text-xs mb-2">SIGN UP</p>
          <h2 className="text-white text-xl font-semibold">Create an account to continue</h2>
        </div>

        <form autoComplete="off" onSubmit={handleRegister} className="space-y-4 mb-6">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Email</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              type="email"
              name="email"
              autoComplete="off"
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a preferred username"
              name="username"
              autoComplete="off"
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 text-sm block mb-2">Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Choose a strong password"
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none"
            />
          </div>
        </form>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white py-3 rounded-lg font-medium mb-4"
        >
          {loading ? 'Continuing...' : 'Continue'}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <button onClick={onSwitch} className="text-white hover:underline">
            Login →
          </button>
        </p>
      </div>
    </div>
  )
}
