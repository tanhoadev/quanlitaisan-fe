import { Navigate, Outlet } from 'react-router-dom'
import authService from '../../services/authService'

function RoleRoute({ allowedRoles }) {
    const user = authService.getUser()

    if (!user) {
        return <Navigate to="/login" replace />
    }

    const hasPermission = allowedRoles.some((role) =>
        user.roles?.includes(role)
    )

    if (!hasPermission) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

export default RoleRoute