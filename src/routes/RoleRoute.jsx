import { Navigate, Outlet } from 'react-router-dom'
import authService from '../services/authService'

function RoleRoute({ allowedRoles = [] }) {
    const user = authService.getUser()

    if (!authService.isAuthenticated() || !user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        )
    }

    const userRoles =
        Array.isArray(user.roles)
            ? user.roles
            : []

    const hasPermission =
        allowedRoles.some((role) =>
            userRoles.includes(role)
        )

    if (!hasPermission) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        )
    }

    return <Outlet />
}

export default RoleRoute