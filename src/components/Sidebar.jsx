import { NavLink } from 'react-router-dom'
import authService from '../services/authService'

function Sidebar() {
    const user = authService.getUser()

    // ==================================================
    // ROLES
    // ==================================================
    const isAdmin =
        user?.roles?.includes('Admin')

    const isAssetManager =
        user?.roles?.includes('AssetManager')

    const canManageAssets =
        isAdmin || isAssetManager

    // ==================================================
    // MENU STYLE
    // ==================================================
    const menuClass = ({ isActive }) =>
        `block rounded-lg px-4 py-3 text-sm font-medium transition ${isActive
            ? 'bg-blue-600 text-white'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
        }`

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 overflow-y-auto bg-slate-900 p-5 text-white">
            {/* ==================================================
                LOGO / TITLE
            ================================================== */}
            <div className="mb-8">
                <h1 className="text-xl font-bold">
                    Asset Management
                </h1>

                <p className="mt-1 text-xs text-slate-400">
                    Management System
                </p>
            </div>

            <nav className="space-y-1">
                {/* ==================================================
                    DASHBOARD
                    Admin + AssetManager + Employee
                ================================================== */}
                <NavLink
                    to="/dashboard"
                    className={menuClass}
                >
                    Dashboard
                </NavLink>

                {/* ==================================================
                    ASSET MANAGEMENT
                ================================================== */}
                <p className="px-4 pb-1 pt-6 text-xs font-semibold uppercase text-slate-500">
                    Asset Management
                </p>

                {/* All roles */}
                <NavLink
                    to="/assets"
                    className={menuClass}
                >
                    Assets
                </NavLink>

                {/* All roles */}
                <NavLink
                    to="/assignments"
                    className={menuClass}
                >
                    Assignments
                </NavLink>

                {/* Admin + AssetManager */}
                {canManageAssets && (
                    <NavLink
                        to="/transfers"
                        className={menuClass}
                    >
                        Transfers
                    </NavLink>
                )}

                {/* ==================================================
                    OPERATIONS
                ================================================== */}
                <p className="px-4 pb-1 pt-6 text-xs font-semibold uppercase text-slate-500">
                    Operations
                </p>

                {/* Admin + AssetManager */}
                {canManageAssets && (
                    <NavLink
                        to="/inventory"
                        className={menuClass}
                    >
                        Inventory
                    </NavLink>
                )}

                {/* All roles */}
                <NavLink
                    to="/maintenance"
                    className={menuClass}
                >
                    Maintenance
                </NavLink>

                {/* Admin + AssetManager */}
                {canManageAssets && (
                    <NavLink
                        to="/costs"
                        className={menuClass}
                    >
                        Costs
                    </NavLink>
                )}

                {/* ==================================================
                    MASTER DATA
                    Admin + AssetManager
                ================================================== */}
                {canManageAssets && (
                    <>
                        <p className="px-4 pb-1 pt-6 text-xs font-semibold uppercase text-slate-500">
                            Master Data
                        </p>

                        <NavLink
                            to="/departments"
                            className={menuClass}
                        >
                            Departments
                        </NavLink>

                        <NavLink
                            to="/locations"
                            className={menuClass}
                        >
                            Locations
                        </NavLink>

                        <NavLink
                            to="/categories"
                            className={menuClass}
                        >
                            Categories
                        </NavLink>

                        <NavLink
                            to="/vendors"
                            className={menuClass}
                        >
                            Vendors
                        </NavLink>
                    </>
                )}

                {/* ==================================================
                    ADMINISTRATION
                    Admin only
                ================================================== */}
                {isAdmin && (
                    <>
                        <p className="px-4 pb-1 pt-6 text-xs font-semibold uppercase text-slate-500">
                            Administration
                        </p>

                        <NavLink
                            to="/users"
                            className={menuClass}
                        >
                            User Management
                        </NavLink>
                    </>
                )}
            </nav>
        </aside>
    )
}

export default Sidebar