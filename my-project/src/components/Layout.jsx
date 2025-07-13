import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import ServicesSection from './ServicesSection'

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <Outlet />
        <ServicesSection />
      </main>
    </div>
  )
}

export default Layout 