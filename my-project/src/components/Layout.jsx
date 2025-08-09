import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import Chatbot from './Chatbot'

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Handle external redirects that land on root with query params
  if (typeof window !== 'undefined' && isHomePage && location.search) {
    const params = new URLSearchParams(location.search);
    const goto = params.get('goto');
    const paymentId = params.get('paymentId');
    if (goto === 'payment-status' && paymentId) {
      // Clean up URL and navigate internally
      const newUrl = `${window.location.origin}/`;
      window.history.replaceState({}, '', newUrl);
      navigate(`/payment-status?paymentId=${paymentId}`, { replace: true });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-primary">
      <Navbar />
      <main className="pt-16">
        {isHomePage && <HeroSection />}
        <Outlet />
      </main>
      <Chatbot />
    </div>
  )
}

export default Layout 