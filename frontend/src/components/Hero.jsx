import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
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
                </div>

                <HeroCarousel products={products} />
            </div>
        </section>
    );
};

export default Hero;
