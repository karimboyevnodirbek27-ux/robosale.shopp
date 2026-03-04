import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
    FiHome, FiPackage, FiShoppingBag, FiSettings,
    FiPlusCircle, FiEdit, FiTrash2, FiEye, FiSave,
    FiDollarSign, FiBox, FiClock, FiArrowLeft, FiImage,
    FiLock, FiPhone, FiLogOut, FiUpload, FiLink
} from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { formatPrice, categories } from '../data/products';
import './Admin.css';

const API_URL = 'http://localhost:5000/api';

// Admin credentials
const ADMIN_PHONE = '+998507087845';
const ADMIN_PASSWORD = '123456';

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (phone === ADMIN_PHONE && password === ADMIN_PASSWORD) {
            localStorage.setItem('robosale_admin', 'true');
            onLogin();
        } else {
            setError('Telefon raqam yoki parol noto\'g\'ri!');
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="login-header">
                    <span className="login-icon">🤖</span>
                    <h1>RoboSale</h1>
                    <p>Admin Panel</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="login-error">{error}</div>}

                    <div className="login-input-group">
                        <FiPhone className="input-icon" />
                        <input
                            type="tel"
                            placeholder="Telefon raqam"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="login-input-group">
                        <FiLock className="input-icon" />
                        <input
                            type="password"
                            placeholder="Parol"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-submit">
                        Kirish
                    </button>
                </form>

                <Link to="/" className="back-to-site-link">
                    ← Saytga qaytish
                </Link>
            </div>
        </div>
    );
};

// Dashboard Component
const Dashboard = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [productsRes, ordersRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/products?limit=1`),
                fetch(`${API_URL}/orders?limit=5`),
                fetch(`${API_URL}/orders/stats/summary`)
            ]);

            const productsData = await productsRes.json();
            const ordersData = await ordersRes.json();
            const statsData = await statsRes.json();

            if (statsData.success) {
                setStats({
                    totalProducts: productsData.total || 0,
                    totalOrders: statsData.stats.totalOrders,
                    pendingOrders: statsData.stats.pendingOrders,
                    totalRevenue: statsData.stats.totalRevenue
                });
            }

            if (ordersData.success) {
                setRecentOrders(ordersData.orders);
            }
        } catch (error) {
            console.error('Dashboard fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { icon: <FiBox />, label: 'Mahsulotlar', value: stats.totalProducts, color: 'primary' },
        { icon: <FiShoppingBag />, label: 'Jami buyurtmalar', value: stats.totalOrders, color: 'accent' },
        { icon: <FiClock />, label: 'Kutilayotgan', value: stats.pendingOrders, color: 'warning' },
        { icon: <FiDollarSign />, label: 'Daromad', value: formatPrice(stats.totalRevenue), color: 'success' }
    ];

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Xush kelibsiz, Admin!</p>
            </div>

            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div key={index} className={`stat-card stat-${stat.color}`}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-section">
                <div className="section-header">
                    <h2>So'nggi buyurtmalar</h2>
                    <Link to="/admin/orders" className="view-all">Barchasini ko'rish</Link>
                </div>

                {loading ? (
                    <div className="loading">Yuklanmoqda...</div>
                ) : recentOrders.length === 0 ? (
                    <div className="empty-state">Hali buyurtmalar yo'q</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Buyurtma #</th>
                                <th>Sana</th>
                                <th>Holat</th>
                                <th>Summa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map(order => (
                                <tr key={order._id}>
                                    <td><strong>{order.orderNumber}</strong></td>
                                    <td>{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</td>
                                    <td>
                                        <span className={`status-badge status-${order.orderStatus}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td>{formatPrice(order.totalAmount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// Product Form Component (Add/Edit)
const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const isEdit = Boolean(id);
    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageMode, setImageMode] = useState('url'); // 'url' or 'file'
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'arduino',
        stockCount: '10',
        image: '',
        featured: false
    });

    useEffect(() => {
        if (isEdit) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/products/${id}`);
            const data = await res.json();
            if (data.success) {
                const p = data.product;
                setFormData({
                    name: p.name || '',
                    description: p.description || '',
                    price: String(p.price || ''),
                    category: p.category || 'arduino',
                    stockCount: String(p.stockCount || '10'),
                    image: p.image || '',
                    featured: p.featured || false
                });
            }
        } catch (error) {
            toast.error('Mahsulotni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Fayl yuklash funksiyasi
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Fayl turini tekshirish
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Faqat rasm fayllarini yuklash mumkin (JPEG, PNG, GIF, WEBP)');
            return;
        }

        // Fayl hajmini tekshirish (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Fayl hajmi 5MB dan oshmasligi kerak');
            return;
        }

        setUploading(true);
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('image', file);

            const res = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formDataUpload
            });

            const data = await res.json();
            if (data.success) {
                // Backend URL bilan to'liq URL yaratish
                const fullImageUrl = `http://localhost:5000${data.imageUrl}`;
                setFormData(prev => ({
                    ...prev,
                    image: fullImageUrl
                }));
                toast.success('Rasm muvaffaqiyatli yuklandi!');
            } else {
                toast.error(data.message || 'Rasm yuklashda xatolik');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Rasm yuklashda xatolik yuz berdi');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.image) {
            toast.error('Nomi, narxi va rasm kiritilishi shart!');
            return;
        }

        setSaving(true);
        try {
            const url = isEdit ? `${API_URL}/products/${id}` : `${API_URL}/products`;
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price),
                    stockCount: Number(formData.stockCount)
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(isEdit ? 'Mahsulot yangilandi!' : 'Mahsulot qo\'shildi!');
                navigate('/admin/products', { preventScrollReset: true });
            } else {
                toast.error(data.message || 'Xatolik yuz berdi');
            }
        } catch (error) {
            toast.error('Server xatoligi');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Yuklanmoqda...</div>;
    }

    return (
        <div className="product-form-page">
            <div className="page-header">
                <Link to="/admin/products" className="back-btn">
                    <FiArrowLeft /> Orqaga
                </Link>
                <h1>{isEdit ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot qo\'shish'}</h1>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                    <div className="form-section">
                        <h3>Asosiy ma'lumotlar</h3>

                        <div className="form-group">
                            <label>Mahsulot nomi *</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Masalan: Arduino Uno R3"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Tavsif</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Mahsulot haqida qisqa tavsif"
                                rows="4"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Narxi (so'm) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="150000"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Ombordagi soni</label>
                                <input
                                    type="number"
                                    name="stockCount"
                                    value={formData.stockCount}
                                    onChange={handleChange}
                                    placeholder="10"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Kategoriya</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={formData.featured}
                                    onChange={handleChange}
                                />
                                <span>Mashhur mahsulot</span>
                            </label>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Rasm</h3>

                        {/* Rasm yuklash usulini tanlash */}
                        <div className="image-mode-toggle">
                            <button
                                type="button"
                                className={`mode-btn ${imageMode === 'url' ? 'active' : ''}`}
                                onClick={() => setImageMode('url')}
                            >
                                <FiLink /> URL orqali
                            </button>
                            <button
                                type="button"
                                className={`mode-btn ${imageMode === 'file' ? 'active' : ''}`}
                                onClick={() => setImageMode('file')}
                            >
                                <FiUpload /> Fayl yuklash
                            </button>
                        </div>

                        {imageMode === 'url' ? (
                            <div className="form-group">
                                <label>Rasm URL manzili *</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        ) : (
                            <div className="form-group">
                                <label>Kompyuterdan rasm yuklash *</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    onChange={handleFileUpload}
                                    style={{ display: 'none' }}
                                />
                                <div
                                    className="file-upload-zone"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {uploading ? (
                                        <div className="upload-loading">
                                            <div className="spinner"></div>
                                            <span>Yuklanmoqda...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <FiUpload className="upload-icon" />
                                            <span>Rasm tanlash uchun bosing</span>
                                            <small>JPEG, PNG, GIF, WEBP (max 5MB)</small>
                                        </>
                                    )}
                                </div>
                                {formData.image && (
                                    <input
                                        type="text"
                                        value={formData.image}
                                        readOnly
                                        className="uploaded-url"
                                        placeholder="Yuklangan rasm URL"
                                    />
                                )}
                            </div>
                        )}

                        <div className="image-preview">
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/placeholder.svg';
                                    }}
                                />
                            ) : (
                                <div className="no-image">
                                    <FiImage />
                                    <span>Rasm tanlang</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-secondary">
                        Bekor qilish
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
                        <FiSave />
                        {saving ? 'Saqlanmoqda...' : (isEdit ? 'Saqlash' : 'Qo\'shish')}
                    </button>
                </div>
            </form>
        </div>
    );
};

// Products Management
const ProductsManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    useEffect(() => {
        fetchProducts();

        // Scroll pozitsiyasini tiklash
        const savedScroll = sessionStorage.getItem('admin_products_scroll');
        if (savedScroll) {
            const mainContainer = document.querySelector('.admin-main');
            if (mainContainer) {
                setTimeout(() => {
                    mainContainer.scrollTop = parseInt(savedScroll, 10);
                }, 100);
            }
            sessionStorage.removeItem('admin_products_scroll');
        }
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/products?limit=100`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            toast.error('Mahsulotlarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Rostdan o\'chirmoqchimisiz?')) return;

        try {
            const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setProducts(prev => prev.filter(p => p._id !== id));
                toast.success('Mahsulot o\'chirildi');
            }
        } catch (error) {
            toast.error('O\'chirishda xatolik');
        }
    };

    // Generate product code
    const getProductCode = (product) => {
        const id = product._id || product.id;
        if (typeof id === 'string' && id.length > 6) {
            return '#' + id.slice(-4).toUpperCase();
        }
        return '#' + String(id).padStart(3, '0');
    };

    // Scroll pozitsiyasini saqlash
    const saveScrollPosition = () => {
        const mainContainer = document.querySelector('.admin-main');
        if (mainContainer) {
            sessionStorage.setItem('admin_products_scroll', mainContainer.scrollTop.toString());
        }
    };

    return (
        <div className="admin-products">
            <div className="page-header">
                <h1>Mahsulotlar</h1>
                <Link to="/admin/products/new" className="btn btn-primary">
                    <FiPlusCircle />
                    Yangi mahsulot
                </Link>
            </div>

            {loading ? (
                <div className="loading">Yuklanmoqda...</div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <p>Hali mahsulotlar yo'q</p>
                    <Link to="/admin/products/new" className="btn btn-primary">
                        Birinchi mahsulotni qo'shing
                    </Link>
                </div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Rasm</th>
                                <th>Nomi</th>
                                <th>Kategoriya</th>
                                <th>Narxi</th>
                                <th>Ombor</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product._id}>
                                    <td><code>{getProductCode(product)}</code></td>
                                    <td>
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-thumb"
                                            onError={(e) => e.target.src = '/placeholder.svg'}
                                        />
                                    </td>
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>{product.stockCount || 0}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link to={`/product/${product._id}`} className="action-btn view" title="Ko'rish">
                                                <FiEye />
                                            </Link>
                                            <Link to={`/admin/products/edit/${product._id}`} className="action-btn edit" title="Tahrirlash" onClick={saveScrollPosition}>
                                                <FiEdit />
                                            </Link>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDelete(product._id)}
                                                title="O'chirish"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Orders Management
const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const toast = useToast();

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            let url = `${API_URL}/orders?limit=50`;
            if (filter !== 'all') url += `&status=${filter}`;

            const res = await fetch(url);
            const data = await res.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            toast.error('Buyurtmalarni yuklashda xatolik');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderStatus: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                setOrders(prev => prev.map(o =>
                    o._id === orderId ? { ...o, orderStatus: newStatus } : o
                ));
                toast.success('Status yangilandi');
            }
        } catch (error) {
            toast.error('Xatolik yuz berdi');
        }
    };

    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const statusLabels = {
        pending: 'Kutilmoqda',
        processing: 'Tayyorlanmoqda',
        shipped: 'Yo\'lda',
        delivered: 'Yetkazildi',
        cancelled: 'Bekor qilindi'
    };

    return (
        <div className="admin-orders">
            <div className="page-header">
                <h1>Buyurtmalar</h1>
                <div className="filter-tabs">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        Barchasi
                    </button>
                    {statuses.slice(0, 4).map(status => (
                        <button
                            key={status}
                            className={filter === status ? 'active' : ''}
                            onClick={() => setFilter(status)}
                        >
                            {statusLabels[status]}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="loading">Yuklanmoqda...</div>
            ) : orders.length === 0 ? (
                <div className="empty-state">Buyurtmalar topilmadi</div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Buyurtma #</th>
                                <th>Mijoz</th>
                                <th>Sana</th>
                                <th>Summa</th>
                                <th>Holat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td><strong>{order.orderNumber}</strong></td>
                                    <td>
                                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                        <br />
                                        <small>{order.shippingAddress?.phone}</small>
                                    </td>
                                    <td>{new Date(order.createdAt).toLocaleDateString('uz-UZ')}</td>
                                    <td>{formatPrice(order.totalAmount)}</td>
                                    <td>
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className={`status-select status-${order.orderStatus}`}
                                        >
                                            {statuses.map(status => (
                                                <option key={status} value={status}>
                                                    {statusLabels[status]}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Main Admin Component
const Admin = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const isAdmin = localStorage.getItem('robosale_admin') === 'true';
        setIsLoggedIn(isAdmin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('robosale_admin');
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
    }

    const menuItems = [
        { path: '/admin', icon: <FiHome />, label: 'Dashboard', exact: true },
        { path: '/admin/products', icon: <FiPackage />, label: 'Mahsulotlar' },
        { path: '/admin/orders', icon: <FiShoppingBag />, label: 'Buyurtmalar' },
        { path: '/admin/settings', icon: <FiSettings />, label: 'Sozlamalar' }
    ];

    const isActive = (path, exact) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="sidebar-header">
                    <h2>🤖 RoboSale</h2>
                    <span>Admin Panel</span>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <FiLogOut />
                        Chiqish
                    </button>
                    <Link to="/" className="back-to-site">
                        ← Saytga qaytish
                    </Link>
                </div>
            </aside>

            <main className="admin-main">
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsManagement />} />
                    <Route path="products/new" element={<ProductForm />} />
                    <Route path="products/edit/:id" element={<ProductForm />} />
                    <Route path="orders" element={<OrdersManagement />} />
                    <Route path="settings" element={<div className="coming-soon">Tez kunda...</div>} />
                </Routes>
            </main>
        </div>
    );
};

export default Admin;
