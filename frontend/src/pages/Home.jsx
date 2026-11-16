import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { categories, products as localProducts } from '../data/products';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import { FaTelegram } from 'react-icons/fa';
import { apiFetch } from '../lib/api';
import './Home.css';

const TELEGRAM_LINK = 'https://t.me/Karimboyev_Nodirbek';

const CATEGORY_SHORT = {
    arduino: 'Arduino',
    sensors: 'Sensorlar',
    motors: 'Motorlar',
    modules: 'Modullar',
    kits: 'Kitlar',
    power: 'Quvvat',
    cables: 'Kabellar',
    tools: 'Asboblar',
    accessories: 'Aksessuar',
    robots: 'Robotlar'
};

const CATEGORY_IMG = {
    arduino: '/images/categories/arduino.jpg',
    sensors: '/images/categories/sensors.jpg',
    motors: '/images/categories/motors.jpg',
    modules: '', // TODO: modullar.png tayyor bo'lganda qo'shiladi
    kits: '/images/categories/kits.jpg',
    power: '/images/categories/power.jpg',
    cables: '/images/categories/cables.jpg',
    tools: '/images/categories/tools.jpg',
    accessories: '/images/categories/accessories.jpg',
    robots: '/images/categories/kits.jpg'
};

const Home = () => {
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await apiFetch('/products?limit=200');
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

    return (
        <div className="home-page">
            <Hero products={products} />

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <div className="section-title">
                            <h2>Kategoriyalar</h2>
                        </div>
                        <Link to="/products" className="view-all-btn">
                            <span>Barchasini ko'rish</span>
                            <FiArrowRight />
                        </Link>
                    </div>
                    <div className="categories-grid">
                        {categories
                            .filter((category) => CATEGORY_IMG[category.id])
                            .map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/products?category=${category.id}`}
                                    className="category-card"
                                    aria-label={CATEGORY_SHORT[category.id] || category.name}
                                >
                                    <div className="category-ring">
                                        <img
                                            src={CATEGORY_IMG[category.id]}
                                            alt={CATEGORY_SHORT[category.id] || category.name}
                                            loading="lazy"
                                        />
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            </section>

            {/* Products Section - More Products */}
            <section className="featured-section">
                <div className="container">
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

