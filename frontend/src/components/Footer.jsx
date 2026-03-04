import { Link } from 'react-router-dom';
import { FiPhone, FiMapPin } from 'react-icons/fi';
import { FaTelegram, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                {/* Main Footer */}
                <div className="footer-main">
                    {/* Brand */}
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <img src="/logo.svg" alt="RoboSale" className="footer-logo-image" />
                            <span className="logo-text">
                                Robo<span className="logo-accent">Sale</span>
                            </span>
                        </Link>
                        <p className="footer-description">
                            Qoraqalpog'iston va O'zbekiston bo'ylab robotika va elektronika mahsulotlarini yetkazib berish.
                            Arduino, sensorlar, motorlar va robot kitlar.
                        </p>
                        <div className="footer-socials">
                            <a href="https://t.me/Robo_Sale" target="_blank" rel="noopener noreferrer" className="social-link telegram" title="Telegram Kanal">
                                <FaTelegram />
                            </a>
                            <a href="https://t.me/RoboSale_group" target="_blank" rel="noopener noreferrer" className="social-link telegram" title="Telegram Guruh">
                                <FaTelegram />
                            </a>
                            <a href="https://instagram.com/robosale" target="_blank" rel="noopener noreferrer" className="social-link" title="Instagram">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="footer-links-group">
                        <h4>Sahifalar</h4>
                        <ul className="footer-links">
                            <li><Link to="/">Asosiy</Link></li>
                            <li><Link to="/products">Mahsulotlar</Link></li>
                            <li><Link to="/cart">Savat</Link></li>
                            <li><Link to="/about">Biz haqimizda</Link></li>
                            <li><Link to="/contact">Aloqa</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links-group">
                        <h4>Kategoriyalar</h4>
                        <ul className="footer-links">
                            <li><Link to="/products?category=arduino">Arduino & MCU</Link></li>
                            <li><Link to="/products?category=sensors">Sensorlar</Link></li>
                            <li><Link to="/products?category=motors">Motorlar</Link></li>
                            <li><Link to="/products?category=kits">Robot Kitlar</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="footer-contact">
                        <h4>Bog'lanish</h4>
                        <ul className="contact-list">
                            <li>
                                <FiMapPin className="contact-icon" />
                                <span>Qoraqalpog'iston Respublikasi, Beruniy tumani</span>
                            </li>
                            <li>
                                <FiPhone className="contact-icon" />
                                <a href="tel:+998907087845">+998 90 708 78 45</a>
                            </li>
                            <li>
                                <FiPhone className="contact-icon" />
                                <a href="tel:+998507087845">+998 50 708 78 45</a>
                            </li>
                            <li>
                                <FaTelegram className="contact-icon" />
                                <a href="https://t.me/Robo_Sale" target="_blank" rel="noopener noreferrer">
                                    📢 @Robo_Sale (Kanal)
                                </a>
                            </li>
                            <li>
                                <FaTelegram className="contact-icon" />
                                <a href="https://t.me/RoboSale_group" target="_blank" rel="noopener noreferrer">
                                    💬 @RoboSale_group (Guruh)
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="footer-bottom">
                    <p>&copy; {currentYear} RoboSale. Barcha huquqlar himoyalangan.</p>
                    <div className="footer-bottom-links">
                        <a href="https://t.me/Robo_Sale" target="_blank" rel="noopener noreferrer">
                            📢 Telegram Kanalimiz
                        </a>
                        <a href="https://t.me/RoboSale_group" target="_blank" rel="noopener noreferrer">
                            💬 Telegram Guruhimiz
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
