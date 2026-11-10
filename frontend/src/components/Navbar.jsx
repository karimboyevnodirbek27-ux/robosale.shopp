import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiMenu, FiX, FiUser, FiSun, FiMoon, FiSearch, FiHeart, FiLogOut, FiChevronDown, FiSettings } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);
    const { getTotalItems } = useCart();
    const { getTotalItems: getWishlistItems } = useWishlist();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const totalItems = getTotalItems();
    const wishlistCount = getWishlistItems();

    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Tashqariga bosilganda foydalanuvchi menyusini yopish
    useEffect(() => {
        if (!userMenuOpen) return;

        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [userMenuOpen]);

    // Sahifa almashganda menyuni yopish
    useEffect(() => {
        setUserMenuOpen(false);
        setIsMenuOpen(false);
    }, [location.pathname, location.search]);

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
        setUserMenuOpen(false);
        logout();
        navigate('/');
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
                        <div className="user-menu-wrapper" ref={userMenuRef}>
                            <button
                                className="user-chip"
                                onClick={() => setUserMenuOpen(open => !open)}
                                title={user?.name || 'Menu'}
                                aria-expanded={userMenuOpen}
                            >
                                <span className="user-chip-avatar">
                                    {(user?.name?.[0] || 'U').toUpperCase()}
                                </span>
                                <span className="user-chip-name">
                                    {user?.name?.split(' ')[0] || 'Foydalanuvchi'}
                                </span>
                                <FiChevronDown className={`user-chip-chevron ${userMenuOpen ? 'open' : ''}`} />
                            </button>

                            {userMenuOpen && (
                                <div className="user-dropdown" role="menu">
                                    <div className="user-info">
                                        <span className="user-name">{user?.name}</span>
                                        <span className="user-email">{user?.email}</span>
                                        {user?.role === 'admin' && (
                                            <span className="admin-badge"><FiSettings /> Admin</span>
                                        )}
                                    </div>
                                    <div className="dropdown-divider" />
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" className="dropdown-item" role="menuitem">
                                            <FiSettings /> Admin panel
                                        </Link>
                                    )}
                                    <button className="dropdown-item logout" onClick={handleLogout} role="menuitem">
                                        <FiLogOut /> Chiqish
                                    </button>
                                </div>
                            )}
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
