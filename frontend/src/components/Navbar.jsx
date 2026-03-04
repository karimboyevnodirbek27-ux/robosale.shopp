import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiSun, FiMoon, FiSearch, FiHeart, FiLogOut } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { getTotalItems } = useCart();
    const { getTotalItems: getWishlistItems } = useWishlist();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const totalItems = getTotalItems();
    const wishlistCount = getWishlistItems();

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('robosale_user') || 'null');
    const isAuthenticated = !!user;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { path: '/', label: 'Asosiy' },
        { path: '/products', label: 'Mahsulotlar' },
        { path: '/products?category=modules', label: 'Modullar' },
        { path: '/products?category=kits', label: 'Kitlar' },
        { path: '/about', label: 'Biz haqimizda' },
        { path: '/contact', label: 'Aloqa' }
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('robosale_user');
        localStorage.removeItem('robosale_token');
        window.location.href = '/';
    };

    // Don't show navbar on admin pages
    if (location.pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <img
                        src="/logo.svg"
                        alt="RoboSale Logo"
                        className="logo-img"
                    />
                    <span className="logo-text">
                        Robo<span className="logo-accent">Sale</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
                    {navLinks.map(link => {
                        // Full URL with query string for comparison
                        const currentFullPath = location.pathname + location.search;

                        // Check if this link is active
                        const isActive = link.path.includes('?')
                            ? currentFullPath === link.path // For links with query params (like Kitlar)
                            : link.path === '/'
                                ? location.pathname === '/' // Exact match for home
                                : link.path === '/products'
                                    ? location.pathname === '/products' && !location.search.includes('category=') // Products without category
                                    : location.pathname === link.path; // Other pages

                        return (
                            <li key={link.path}>
                                <Link
                                    to={link.path}
                                    className={`nav-link ${isActive ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {link.label}
                                    <span className="nav-link-indicator"></span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Search Bar */}
                <form className="navbar-search" onSubmit={handleSearch}>
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Mahsulot qidirish..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>

                {/* Actions */}
                <div className="navbar-actions">
                    <button
                        className="action-btn theme-toggle"
                        onClick={toggleTheme}
                        title={isDark ? 'Yorug\' rejim' : 'Qorong\'i rejim'}
                    >
                        <span className="btn-glow"></span>
                        {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>

                    <Link to="/wishlist" className="action-btn wishlist-btn" title="Istaklar">
                        <span className="btn-glow"></span>
                        <FiHeart size={20} />
                        {wishlistCount > 0 && (
                            <span className="wishlist-badge">{wishlistCount}</span>
                        )}
                    </Link>

                    <Link to="/cart" className="action-btn cart-btn">
                        <span className="btn-glow"></span>
                        <FiShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="cart-badge">{totalItems}</span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="user-panel">
                            <div className="user-avatar-box">
                                <span className="user-avatar-letter">{user?.firstName?.[0] || 'U'}</span>
                            </div>
                            <div className="user-info-box">
                                <span className="user-welcome-text">
                                    <span className="user-name-text">{user?.firstName}</span>, xush kelibsiz! 👋
                                </span>
                            </div>
                            <button className="logout-btn-nav" onClick={handleLogout} title="Chiqish">
                                <FiLogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="login-btn">
                            <FiUser size={18} />
                            <span>Kirish</span>
                        </Link>
                    )}

                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
