import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { categories, products as localProducts } from '../data/products';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones, FiCreditCard, FiPackage, FiZap } from 'react-icons/fi';
import { FaTelegram } from 'react-icons/fa';
import './Home.css';

const TELEGRAM_LINK = 'https://t.me/Karimboyev_Nodirbek';
const API_URL = 'http://localhost:5000/api';

const Home = () => {
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/products`);
                const data = await response.json();

                if (data.success) {
                    setProducts(data.products);
                } else {
                    // Fallback to local data
                    setProducts(localProducts);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                // Fallback to local data if API fails
                setProducts(localProducts);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Get all products, sorted by featured first
    const allProducts = [...products].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    const displayProducts = showAllProducts ? allProducts : allProducts.slice(0, 12);

    const features = [
        {
            icon: <FiPackage />,
            title: 'Original mahsulotlar',
            description: 'Sifatli va kafolatlangan',
            link: null
        },
        {
            icon: <FiTruck />,
            title: 'Tezkor yetkazish',
            description: 'Beruniy bo\'ylab 1-2 kunda',
            link: null
        },
        {
            icon: <FaTelegram />,
            title: 'Texnik yordam',
            description: '24/7 Telegram qo\'llab-quvvatlash',
            link: TELEGRAM_LINK
        },
        {
            icon: <FiCreditCard />,
            title: 'Qulay to\'lov',
            description: 'Naqd, karta, Click',
            link: null
        }
    ];

    return (
        <div className="home-page">
            <Hero />

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/products?category=${category.id}`}
                                className="category-card"
                            >
                                <div className="category-icon-wrapper">
                                    <span className="category-icon">{category.icon}</span>
                                </div>
                                <h3>{category.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Products Section - More Products */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-title">
                            <h2>Mahsulotlar</h2>
                            <p>Arduino, sensorlar, motorlar va robot kitlar</p>
                        </div>
                        <Link to="/products" className="view-all-btn">
                            <span>Barchasini ko'rish</span>
                            <FiArrowRight />
                        </Link>
                    </div>

                    {loading ? (
                        <ProductGridSkeleton count={8} />
                    ) : (
                        <div className="products-grid grid grid-4">
                            {displayProducts.map(product => (
                                <ProductCard key={product._id || product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {!loading && !showAllProducts && allProducts.length > 12 && (
                        <div className="load-more-container">
                            <button
                                className="btn btn-secondary btn-lg load-more-btn"
                                onClick={() => setShowAllProducts(true)}
                            >
                                <span>Ko'proq ko'rish ({allProducts.length - 12} ta qoldi)</span>
                                <FiArrowRight />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            feature.link ? (
                                <a
                                    key={index}
                                    href={feature.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="feature-card feature-link"
                                    style={{ '--delay': `${index * 0.1}s` }}
                                >
                                    <div className="feature-icon">
                                        {feature.icon}
                                    </div>
                                    <div className="feature-content">
                                        <h3>{feature.title}</h3>
                                        <p>{feature.description}</p>
                                    </div>
                                </a>
                            ) : (
                                <div
                                    key={index}
                                    className="feature-card"
                                    style={{ '--delay': `${index * 0.1}s` }}
                                >
                                    <div className="feature-icon">
                                        {feature.icon}
                                    </div>
                                    <div className="feature-content">
                                        <h3>{feature.title}</h3>
                                        <p>{feature.description}</p>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </section>

            {/* Telegram Support Banner */}
            <section className="telegram-section">
                <div className="container">
                    <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="telegram-banner">
                        <FaTelegram className="telegram-icon" />
                        <div className="telegram-text">
                            <h3>Savol bormi? Telegram orqali yozing!</h3>
                            <p>@Karimboyev_Nodirbek - 24/7 texnik yordam</p>
                        </div>
                        <FiArrowRight className="telegram-arrow" />
                    </a>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <div className="cta-bg">
                            <div className="cta-orb orb-1"></div>
                            <div className="cta-orb orb-2"></div>
                        </div>
                        <div className="cta-content">
                            <div className="cta-icon">
                                <FiZap />
                            </div>
                            <h2>Robotika loyihangizni <span className="gradient-text">bugun</span> boshlang!</h2>
                            <p>Original mahsulotlar, Beruniy tumani bo'ylab yetkazib berish</p>
                            <div className="cta-buttons">
                                <Link to="/products" className="btn btn-primary btn-lg">
                                    <span>Xarid qilish</span>
                                    <FiArrowRight />
                                </Link>
                                <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg">
                                    <FaTelegram />
                                    <span>Telegram</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
