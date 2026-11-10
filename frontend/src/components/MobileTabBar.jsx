import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiGrid, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './MobileTabBar.css';

const MobileTabBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { getTotalItems } = useCart();
    const { isAuthenticated } = useAuth();
    const cartCount = getTotalItems();

    const tabs = [
        { path: '/', icon: <FiHome />, label: 'Bosh sahifa', match: (p) => p === '/' },
        { path: '/products', icon: <FiGrid />, label: 'Kategoriya', match: (p) => p.startsWith('/products') || p.startsWith('/product/') },
        { path: '/cart', icon: <FiShoppingCart />, label: 'Savat', match: (p) => p.startsWith('/cart'), badge: cartCount },
        { path: isAuthenticated ? '/admin' : '/login', icon: <FiUser />, label: isAuthenticated ? 'Profil' : 'Kirish', match: (p) => p.startsWith('/login') || p.startsWith('/register') || p.startsWith('/admin') }
    ];

    return (
        <nav className="mobile-tabbar" aria-label="Asosiy navigatsiya">
            {tabs.map((tab) => {
                const active = tab.match(location.pathname);
                return (
                    <button
                        key={tab.label}
                        className={`mobile-tab ${active ? 'active' : ''}`}
                        onClick={() => navigate(tab.path)}
                        aria-current={active ? 'page' : undefined}
                    >
                        <span className="mobile-tab-icon">
                            {tab.icon}
                            {tab.badge > 0 && <span className="mobile-tab-badge">{tab.badge}</span>}
                        </span>
                        <span className="mobile-tab-label">{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default MobileTabBar;
