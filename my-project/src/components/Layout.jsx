import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import HeroSection from './HeroSection'


const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-primary">
      <Navbar />
      <main className="pt-16">
        {isHomePage && <HeroSection />}
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 