import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi';
import HeroCarousel from './HeroCarousel';
import './Hero.css';

const Hero = ({ products = [] }) => {
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

                    <div className="hero-buttons animate-fadeInUp delay-2">
                        <Link to="/products" className="btn btn-primary btn-lg">
                            <span>Xarid qilish</span>
                            <FiArrowRight />
                        </Link>
                    </div>

                    {/* Mini feature tiles — yozuv va tugma tagida */}
                    <div className="hero-features animate-fadeInUp delay-3">
                        <div className="hf-tile">
                            <div className="hf-icon"><FiTruck /></div>
                            <div className="hf-text">
                                <h4>Tez yetkazib berish</h4>
                                <p>Beruniy bo'ylab 1-2 kunda</p>
                            </div>
                        </div>
                        <div className="hf-tile">
                            <div className="hf-icon"><FiShield /></div>
                            <div className="hf-text">
                                <h4>Sifat kafolati</h4>
                                <p>Original mahsulotlar</p>
                            </div>
                        </div>
                        <a
                            className="hf-tile hf-link"
                            href="https://t.me/Karimboyev_Nodirbek"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Telegram orqali yordam"
                        >
                            <div className="hf-icon"><FiHeadphones /></div>
                            <div className="hf-text">
                                <h4>24/7 Yordam</h4>
                                <p>Telegram orqali</p>
                            </div>
                        </a>
                    </div>
                </div>

                <HeroCarousel products={products} />
            </div>
        </section>
    );
};

export default Hero;
