import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

function MainLayout() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />

            <div className="ml-64">
                <Header />

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default MainLayout