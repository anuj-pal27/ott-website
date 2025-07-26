import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import AdminDashboard from './pages/AdminDashboard'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import AdminAuth from './pages/AdminAuth'
import AddSubscription from './pages/AddSubscription'
import EditSubscription from './pages/EditSubscription'
import { AuthProvider } from './context/AuthContext'
import Checkout from './pages/Checkout'
import { CartProvider } from './context/CartContext'
import Category from './pages/Category';
import PaymentStatus from './pages/PaymentStatus';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Disclaimer from './pages/Disclaimer';
import RefundPolicy from './pages/RefundPolicy';
import PaymentHistory from './pages/PaymentHistory';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          {/* Layout route that includes Navbar */}
          <Route path="/" element={<Layout />}>
            {/* Nested routes that will render inside the Layout */}
            <Route index element={<Dashboard />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
  
            <Route path="categories/:category" element={<Category />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="disclaimer" element={<Disclaimer />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
          </Route>
          {/* Auth routes without navbar */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-dashboard/add" element={<AddSubscription />} />
          <Route path="/admin-dashboard/edit/:planId" element={<EditSubscription />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-status" element={<PaymentStatus />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
