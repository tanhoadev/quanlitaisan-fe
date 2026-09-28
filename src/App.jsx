import {
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'
import MainLayout from './layouts/MainLayout'

import AssetsPage from './pages/AssetsPage'
import AssetDetailPage from './pages/AssetDetailPage'
import AssetCreatePage from './pages/AssetCreatePage'
import AssetEditPage from './pages/AssetEditPage'

import AssignmentsPage from './pages/AssignmentsPage'
import AssignmentCreatePage from './pages/AssignmentCreatePage'
import AssignmentDetailPage from './pages/AssignmentDetailPage'

import TransfersPage from './pages/TransfersPage'
import TransferCreatePage from './pages/TransferCreatePage'
import TransferDetailPage from './pages/TransferDetailPage'

import InventoryPage from './pages/InventoryPage'
import InventoryCreatePage from './pages/InventoryCreatePage'
import InventoryDetailPage from './pages/InventoryDetailPage'

import MaintenancePage from './pages/MaintenancePage'
import MaintenanceRequestCreatePage from './pages/MaintenanceRequestCreatePage'
import MaintenanceRequestDetailPage from './pages/MaintenanceRequestDetailPage'
import MaintenancePlanCreatePage from './pages/MaintenancePlanCreatePage'
import MaintenancePlanDetailPage from './pages/MaintenancePlanDetailPage'

import CostsPage from './pages/CostsPage'
import CostCreatePage from './pages/CostCreatePage'
import CostDetailPage from './pages/CostDetailPage'
import CostEditPage from './pages/CostEditPage'

import VendorsPage from './pages/vendors/VendorsPage'
import VendorCreatePage from './pages/vendors/VendorCreatePage'
import VendorEditPage from './pages/vendors/VendorEditPage'

import DepartmentsPage from './pages/departments/DepartmentsPage'
import DepartmentCreatePage from './pages/departments/DepartmentCreatePage'
import DepartmentEditPage from './pages/departments/DepartmentEditPage'

import LocationsPage from './pages/locations/LocationsPage'
import LocationCreatePage from './pages/locations/LocationCreatePage'
import LocationEditPage from './pages/locations/LocationEditPage'

import CategoriesPage from './pages/categories/CategoriesPage'
import CategoryCreatePage from './pages/categories/CategoryCreatePage'
import CategoryEditPage from './pages/categories/CategoryEditPage'

import UsersPage from './pages/users/UsersPage'
import UserCreatePage from './pages/users/UserCreatePage'
import UserEditPage from './pages/users/UserEditPage'

function App() {
  return (
    <Routes>
      {/* ==================================================
                PUBLIC
            ================================================== */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      {/* ==================================================
                AUTHENTICATED USERS
            ================================================== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* ==========================================
                        ALL ROLES
                        Admin + AssetManager + Employee
                    ========================================== */}
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          {/* Assets */}
          <Route
            path="/assets"
            element={<AssetsPage />}
          />

          <Route
            path="/assets/:id"
            element={<AssetDetailPage />}
          />

          {/* Assignments */}
          <Route
            path="/assignments"
            element={<AssignmentsPage />}
          />

          <Route
            path="/assignments/create"
            element={<AssignmentCreatePage />}
          />

          <Route
            path="/assignments/:id"
            element={<AssignmentDetailPage />}
          />

          {/* Maintenance */}
          <Route
            path="/maintenance"
            element={<MaintenancePage />}
          />

          <Route
            path="/maintenance/requests/create"
            element={
              <MaintenanceRequestCreatePage />
            }
          />

          <Route
            path="/maintenance/requests/:id"
            element={
              <MaintenanceRequestDetailPage />
            }
          />

          {/* ==========================================
                        ADMIN + ASSET MANAGER
                    ========================================== */}
          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  'Admin',
                  'AssetManager',
                ]}
              />
            }
          >
            {/* Asset write operations */}
            <Route
              path="/assets/create"
              element={<AssetCreatePage />}
            />

            <Route
              path="/assets/:id/edit"
              element={<AssetEditPage />}
            />

            {/* Transfers */}
            <Route
              path="/transfers"
              element={<TransfersPage />}
            />

            <Route
              path="/transfers/create"
              element={
                <TransferCreatePage />
              }
            />

            <Route
              path="/transfers/:id"
              element={
                <TransferDetailPage />
              }
            />

            {/* Inventory */}
            <Route
              path="/inventory"
              element={<InventoryPage />}
            />

            <Route
              path="/inventory/create"
              element={
                <InventoryCreatePage />
              }
            />

            <Route
              path="/inventory/:id"
              element={
                <InventoryDetailPage />
              }
            />

            {/* Maintenance Plans */}
            <Route
              path="/maintenance/plans/create"
              element={
                <MaintenancePlanCreatePage />
              }
            />

            <Route
              path="/maintenance/plans/:id"
              element={
                <MaintenancePlanDetailPage />
              }
            />

            {/* Costs */}
            <Route
              path="/costs"
              element={<CostsPage />}
            />

            <Route
              path="/costs/create"
              element={<CostCreatePage />}
            />

            <Route
              path="/costs/:id"
              element={<CostDetailPage />}
            />

            <Route
              path="/costs/:id/edit"
              element={<CostEditPage />}
            />

            {/* ======================================
                            MASTER DATA
                        ====================================== */}

            {/* Vendors */}
            <Route
              path="/vendors"
              element={<VendorsPage />}
            />

            <Route
              path="/vendors/create"
              element={
                <VendorCreatePage />
              }
            />

            <Route
              path="/vendors/:id/edit"
              element={
                <VendorEditPage />
              }
            />

            {/* Departments */}
            <Route
              path="/departments"
              element={
                <DepartmentsPage />
              }
            />

            <Route
              path="/departments/create"
              element={
                <DepartmentCreatePage />
              }
            />

            <Route
              path="/departments/:id/edit"
              element={
                <DepartmentEditPage />
              }
            />

            {/* Locations */}
            <Route
              path="/locations"
              element={<LocationsPage />}
            />

            <Route
              path="/locations/create"
              element={
                <LocationCreatePage />
              }
            />

            <Route
              path="/locations/:id/edit"
              element={
                <LocationEditPage />
              }
            />

            {/* Categories */}
            <Route
              path="/categories"
              element={<CategoriesPage />}
            />

            <Route
              path="/categories/create"
              element={
                <CategoryCreatePage />
              }
            />

            <Route
              path="/categories/:id/edit"
              element={
                <CategoryEditPage />
              }
            />
          </Route>

          {/* ==========================================
                        ADMIN ONLY
                    ========================================== */}
          <Route
            element={
              <RoleRoute
                allowedRoles={[
                  'Admin',
                ]}
              />
            }
          >
            <Route
              path="/users"
              element={<UsersPage />}
            />

            <Route
              path="/users/create"
              element={
                <UserCreatePage />
              }
            />

            <Route
              path="/users/:id/edit"
              element={
                <UserEditPage />
              }
            />
          </Route>
        </Route>
      </Route>

      {/* ==================================================
                DEFAULT
            ================================================== */}
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  )
}

export default App