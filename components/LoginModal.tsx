import React, { useState } from 'react'

export default function LoginModal({ onClose, onSwitch }: any) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e?: React.FormEvent) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
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
      setError(data.error || 'Login failed')
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
          <p className="text-gray-400 text-xs mb-2">WELCOME BACK</p>
          <h2 className="text-white text-xl font-semibold">Log into your account</h2>
        </div>

        <form autoComplete="off" onSubmit={handleLogin} className="space-y-4 mb-6">
          <div>
            <label className="text-gray-400 text-sm block mb-2">Email or Username</label>
            <input
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              placeholder="Enter your email or username"
              name="identifier"
              autoComplete="off"
              className="w-full bg-gray-700 text-white p-3 rounded-lg outline-none"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-sm">Password</label>
              <a href="#" className="text-gray-400 text-xs hover:text-white">
                Forgot password?
              </a>
            </div>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              name="password"
              autoComplete="off"
              placeholder="Enter your password"
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
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white py-3 rounded-lg font-medium mb-4"
        >
          {loading ? 'Logging...' : 'Login now'}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Not registered yet?{' '}
          <button onClick={onSwitch} className="text-white hover:underline">
            Register →
          </button>
        </p>
      </div>
    </div>
  )
}
