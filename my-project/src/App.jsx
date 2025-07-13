import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import AdminDashboard from './pages/AdminDashboard'


function App() {
  return (
    
      <Routes>
        {/* Layout route that includes Navbar */}
        <Route path="/" element={<Layout />}>
          {/* Nested routes that will render inside the Layout */}
          <Route index element={<Dashboard />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
        
        {/* Auth routes without navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
  )
}

export default App
