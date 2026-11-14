import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
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

                        <div className="showcase-card showcase-main animate-float">
                            <div className="showcase-media">
                                <img
                                    src="/images/products/prod-42.jpg"
                                    alt="Arduino Uno R3"
                                    loading="eager"
                                />
                            </div>
                            <div className="showcase-meta">
                                <span className="showcase-tag">Arduino</span>
                                <span className="showcase-name">Uno R3</span>
                            </div>
                        </div>

                        <div className="showcase-card showcase-mini mini-1 animate-float delay-2">
                            <div className="showcase-media">
                                <img
                                    src="/images/products/prod-19.jpg"
                                    alt="HC-SR04 ultratovush sensori"
                                    loading="lazy"
                                />
                            </div>
                            <span className="showcase-name">HC-SR04</span>
                        </div>

                        <div className="showcase-card showcase-mini mini-2 animate-float delay-3">
                            <div className="showcase-media">
                                <img
                                    src="/images/products/prod-13.jpg"
                                    alt="L298N motor drayver"
                                    loading="lazy"
                                />
                            </div>
                            <span className="showcase-name">L298N</span>
                        </div>

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
