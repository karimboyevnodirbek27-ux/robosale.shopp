import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import { getImageUrl } from '../data/products';
import './Hero.css';

const DEFAULT_SHOWCASE = [
    {
        key: 'main',
        id: 42,
        image: '/images/products/prod-42.jpg',
        tag: 'Arduino',
        name: 'Uno R3',
        alt: 'Arduino Uno R3'
    },
    {
        key: 'mini-1',
        id: 19,
        image: '/images/products/prod-19.jpg',
        name: 'HC-SR04',
        alt: 'HC-SR04 ultratovush sensori'
    },
    {
        key: 'mini-2',
        id: 13,
        image: '/images/products/prod-13.jpg',
        name: 'L298N',
        alt: 'L298N motor drayver'
    }
];

const findProduct = (products, item) => {
    if (!Array.isArray(products) || products.length === 0) return null;
    return (
        products.find((p) => p.id === item.id) ||
        products.find((p) => (p.name || '').toLowerCase().includes(item.name.toLowerCase())) ||
        null
    );
};

const Hero = ({ products = [] }) => {
    const showcase = DEFAULT_SHOWCASE.map((item) => {
        const match = findProduct(products, item);
        return {
            ...item,
            image: getImageUrl(match?.image || item.image),
            link: match ? `/product/${match._id || match.id}` : '/products'
        };
    });

    const [main, mini1, mini2] = showcase;

    return (
        <section className="hero">
            {/* Animated Background */}
            <div className="hero-bg">
                <div className="hero-gradient-orb orb-1"></div>
                <div className="hero-gradient-orb orb-2"></div>
                <div className="hero-gradient-orb orb-3"></div>
                <div className="hero-grid"></div>
                <div className="hero-noise"></div>
            </div>

            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title animate-fadeInUp">
                        <span className="title-line">Arduino &amp; robototexnika</span>
                        <span className="title-line gradient-text">online do'koni</span>
                    </h1>

                    <p className="hero-description animate-fadeInUp delay-2">
                        Sensorlar, motorlar va tayyor robot kitlar — 1–2 kunda yetkazamiz.
                    </p>

                    <div className="hero-buttons animate-fadeInUp delay-3">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            <span>Xarid qilish</span>
                            <FiArrowRight />
                        </Link>
                        <Link to="/products?category=kits" className="btn btn-secondary btn-lg">
                            <span>Kitlarni ko'rish</span>
                        </Link>
                    </div>

                    <div className="hero-stats animate-fadeInUp delay-4">
                        <div className="stat-item">
                            <span className="stat-number">161+</span>
                            <span className="stat-label">Mahsulot</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">1–2 kun</span>
                            <span className="stat-label">Yetkazish</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Yordam</span>
                        </div>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="visual-container">
                        <div className="showcase-glow" aria-hidden="true"></div>

                        <Link
                            to={main.link}
                            className="showcase-card showcase-main animate-float"
                            aria-label={main.alt}
                        >
                            <div className="showcase-media">
                                <img src={main.image} alt={main.alt} loading="eager" />
                            </div>
                            <div className="showcase-meta">
                                <span className="showcase-tag">{main.tag}</span>
                                <span className="showcase-name">{main.name}</span>
                            </div>
                        </Link>

                        <Link
                            to={mini1.link}
                            className="showcase-card showcase-mini mini-1 animate-float delay-2"
                            aria-label={mini1.alt}
                        >
                            <div className="showcase-media">
                                <img src={mini1.image} alt={mini1.alt} loading="lazy" />
                            </div>
                            <span className="showcase-name">{mini1.name}</span>
                        </Link>

                        <Link
                            to={mini2.link}
                            className="showcase-card showcase-mini mini-2 animate-float delay-3"
                            aria-label={mini2.alt}
                        >
                            <div className="showcase-media">
                                <img src={mini2.image} alt={mini2.alt} loading="lazy" />
                            </div>
                            <span className="showcase-name">{mini2.name}</span>
                        </Link>

                        <div className="showcase-chip chip-1">
                            <FiZap />
                            <span>161+ mahsulot</span>
                        </div>

                        <div className="showcase-chip chip-2">
                            <span className="chip-dot"></span>
                            <span>1–2 kunda yetkazish</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
