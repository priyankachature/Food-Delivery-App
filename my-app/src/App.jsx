import './index.css'
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import { Routes, Route } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import Footer from './components/Footer';
import Payment from './pages/Payment';
import ContactUs from './pages/ContactUs';
import OrderConfirmation from './pages/OrderConfirmation';
import PrivateRoute from './components/PrivateRoute';


const App = () => {
  return (
    <>
      <div>
        <Navbar />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<ContactUs />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />

          {/* Protected routes */}

          <Route path='/cart' element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path='/order' element={<PrivateRoute><PlaceOrder /></PrivateRoute>} />
          <Route path='/payment' element={<PrivateRoute><Payment /></PrivateRoute>} />
          <Route path="/orderConfirmation" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />

          <Route path="*" element={<div className="p-8">Not Found</div>} />

        </Routes>
      </div>
      <Footer />

    </>

  )
}

export default App
