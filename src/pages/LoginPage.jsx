import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

function LoginPage() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            setMessage('')

            await authService.login(email, password)

            navigate('/dashboard', {
                replace: true,
            })
        } catch (error) {
            console.error('LOGIN ERROR:', error)

            setMessage(
                error.response?.data?.message ||
                'Login failed. Please check your email and password.'
            )
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* LEFT */}
            <div className="hidden w-1/2 flex-col justify-between bg-slate-900 p-12 text-white lg:flex">
                <div>
                    <div className="mb-16 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold">
                            A
                        </div>

                        <div>
                            <h1 className="text-xl font-semibold">
                                Asset Management
                            </h1>
                            <p className="text-sm text-slate-400">
                                Enterprise Asset Platform
                            </p>
                        </div>
                    </div>

                    <div className="max-w-lg">
                        <h2 className="text-4xl font-bold leading-tight">
                            Manage your assets
                            <br />
                            smarter and easier.
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-slate-400">
                            Track assets, assignments, transfers, inventory,
                            maintenance and costs from one centralized system.
                        </p>
                    </div>
                </div>

                <p className="text-sm text-slate-500">
                    Asset Management System
                </p>
            </div>

            {/* RIGHT */}
            <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
                <div className="w-full max-w-md">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Welcome back
                    </h2>

                    <p className="mt-2 text-gray-500">
                        Sign in to continue to your account.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 space-y-5"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                        {message && (
                            <p className="text-center text-sm text-gray-600">
                                {message}
                            </p>
                        )}
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-400">
                        Asset Management System
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage