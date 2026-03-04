import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ToastProvider>
              <Router>
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/login" element={<Auth />} />
                      <Route path="/register" element={<Auth />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/order-tracking" element={<OrderTracking />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/admin/*" element={<Admin />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </ToastProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Simple About Page
function About() {
  return (
    <div style={{ paddingTop: '120px', minHeight: '60vh' }}>
      <div className="container">
        <div className="section-title">
          <h2 style={{ color: 'var(--text-primary)' }}>Biz haqimizda</h2>
          <p>Qoraqalpog'iston va O'zbekiston bo'ylab robotika yetkazib berish</p>
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '1.125rem', lineHeight: '1.8', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            RoboSale - Arduino, sensorlar, motorlar va robot kitlarni sifatli va arzon narxlarda taqdim etamiz.
            Buyurtmalarni Telegram orqali qabul qilamiz va O'zbekiston bo'ylab yetkazib beramiz.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginTop: '3rem' }}>
            <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0088cc' }}>📱</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Telegram buyurtma</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#10b981' }}>🚚</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Tez yetkazish</p>
            </div>
            <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '1rem', boxShadow: 'var(--shadow)' }}>
              <h3 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#f59e0b' }}>💯</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Sifatli mahsulot</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Contact Page
function Contact() {
  return (
    <div style={{ paddingTop: '120px', minHeight: '60vh' }}>
      <div className="container">
        <div className="section-title">
          <h2 style={{ color: 'var(--text-primary)' }}>Biz bilan bog'laning</h2>
          <p>Buyurtma berish yoki savol uchun Telegramga yozing!</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '1rem', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📞</span>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Telefon</h3>
            <p style={{ color: 'var(--text-secondary)' }}>+998 90 708 78 45</p>
            <p style={{ color: 'var(--text-secondary)' }}>+998 50 708 78 45</p>
          </div>
          <div style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '1rem', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>💬</span>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Telegram</h3>
            <a href="https://t.me/Robo_Sale" target="_blank" rel="noopener noreferrer" style={{ color: '#0088cc', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>📢 @Robo_Sale (Kanal)</a>
            <a href="https://t.me/RoboSale_group" target="_blank" rel="noopener noreferrer" style={{ color: '#0088cc', fontWeight: '600' }}>💬 @RoboSale_group (Guruh)</a>
          </div>
        </div>
        <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: 'var(--bg-card)', borderRadius: '1rem', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>📍</span>
          <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Manzil</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Qoraqalpog'iston Respublikasi, Beruniy tumani</p>
        </div>
      </div>
    </div>
  );
}

export default App;
