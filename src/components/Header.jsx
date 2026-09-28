import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'

function Header() {
    const navigate = useNavigate()
    const user = authService.getUser()

    const handleLogout = () => {
        authService.logout()
        navigate('/login', { replace: true })
    }

    return (
        <header className="flex h-20 items-center justify-between border-b bg-white px-8">
            <div>
                <h2 className="text-lg font-semibold text-slate-800">
                    Asset Management System
                </h2>
            </div>

            <div className="flex items-center gap-5">
                <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                        {user?.fullName}
                    </p>

                    <p className="text-xs text-gray-500">
                        {user?.email}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-100"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}

export default Header