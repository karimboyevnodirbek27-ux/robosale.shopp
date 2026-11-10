import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap, FiCpu, FiSettings } from 'react-icons/fi';
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
                        {/* Main Robot/Circuit Visual */}
                        <div className="main-visual animate-float">
                            <div className="circuit-board">
                                <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Main chip */}
                                    <rect x="140" y="140" width="120" height="120" rx="8" fill="url(#chipGradient)" stroke="url(#borderGradient)" strokeWidth="2" />

                                    {/* Chip pins */}
                                    <g className="chip-pins">
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <rect key={`top-${i}`} x={160 + i * 20} y="120" width="8" height="20" rx="2" fill="url(#pinGradient)" />
                                        ))}
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <rect key={`bottom-${i}`} x={160 + i * 20} y="260" width="8" height="20" rx="2" fill="url(#pinGradient)" />
                                        ))}
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <rect key={`left-${i}`} x="120" y={160 + i * 20} width="20" height="8" rx="2" fill="url(#pinGradient)" />
                                        ))}
                                        {[0, 1, 2, 3, 4].map(i => (
                                            <rect key={`right-${i}`} x="260" y={160 + i * 20} width="20" height="8" rx="2" fill="url(#pinGradient)" />
                                        ))}
                                    </g>

                                    {/* Circuit traces */}
                                    <g className="circuit-traces" stroke="url(#traceGradient)" strokeWidth="2" fill="none">
                                        <path d="M164 120 L164 80 L80 80" className="trace-animate" />
                                        <path d="M204 120 L204 60 L320 60" className="trace-animate delay-1" />
                                        <path d="M120 180 L60 180 L60 300" className="trace-animate delay-2" />
                                        <path d="M280 200 L340 200 L340 100" className="trace-animate delay-3" />
                                        <path d="M184 280 L184 340 L100 340" className="trace-animate delay-4" />
                                        <path d="M224 280 L224 320 L320 320" className="trace-animate delay-5" />
                                    </g>

                                    {/* Connection nodes */}
                                    <g className="nodes">
                                        <circle cx="80" cy="80" r="6" fill="url(#nodeGradient)" className="pulse-node" />
                                        <circle cx="320" cy="60" r="6" fill="url(#nodeGradient)" className="pulse-node delay-1" />
                                        <circle cx="60" cy="300" r="6" fill="url(#nodeGradient)" className="pulse-node delay-2" />
                                        <circle cx="340" cy="100" r="6" fill="url(#nodeGradient)" className="pulse-node delay-3" />
                                        <circle cx="100" cy="340" r="6" fill="url(#nodeGradient)" className="pulse-node delay-4" />
                                        <circle cx="320" cy="320" r="6" fill="url(#nodeGradient)" className="pulse-node delay-5" />
                                    </g>

                                    {/* Chip center glow */}
                                    <circle cx="200" cy="200" r="30" fill="url(#centerGlow)" className="center-pulse" />

                                    {/* Gradients */}
                                    <defs>
                                        <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#111827" />
                                            <stop offset="100%" stopColor="#1F2937" />
                                        </linearGradient>
                                        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#0066FF" />
                                            <stop offset="100%" stopColor="#00D4FF" />
                                        </linearGradient>
                                        <linearGradient id="pinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#00D4FF" />
                                            <stop offset="100%" stopColor="#0066FF" />
                                        </linearGradient>
                                        <linearGradient id="traceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#0066FF" stopOpacity="0.6" />
                                            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.6" />
                                        </linearGradient>
                                        <radialGradient id="nodeGradient">
                                            <stop offset="0%" stopColor="#00D4FF" />
                                            <stop offset="100%" stopColor="#0066FF" />
                                        </radialGradient>
                                        <radialGradient id="centerGlow">
                                            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
                                            <stop offset="50%" stopColor="#0066FF" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#0066FF" stopOpacity="0" />
                                        </radialGradient>
                                    </defs>
                                </svg>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="floating-elements">
                            <div className="floating-card card-1 animate-float">
                                <FiCpu className="card-icon" />
                                <span>Arduino UNO</span>
                            </div>
                            <div className="floating-card card-2 animate-float delay-2">
                                <FiSettings className="card-icon" />
                                <span>Motorlar</span>
                            </div>
                            <div className="floating-card card-3 animate-float delay-4">
                                <FiZap className="card-icon" />
                                <span>Sensorlar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
