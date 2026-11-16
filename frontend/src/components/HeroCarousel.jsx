import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiCheck, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { formatPrice, getImageUrl } from '../data/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import './HeroCarousel.css';

const INTERVAL_MS = 3000;
const MAX_SLIDES = 8;

const HeroCarousel = ({ products = [] }) => {
    const { addToCart } = useCart();
    const toast = useToast();
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const [added, setAdded] = useState(false);
    const touchX = useRef(null);

    const slides = useMemo(() => {
        const list = Array.isArray(products) ? products : [];
        // 1) Chegirmali mahsulotlar: eng katta -% birinchi
        const discounted = list
            .filter((p) => p?.oldPrice > p?.price)
            .map((p) => ({
                ...p,
                _discount: Math.round((1 - p.price / p.oldPrice) * 100)
            }))
            .sort((a, b) => b._discount - a._discount);
        // 2) Yetmaganini featured bilan to'ldiramiz
        const featuredOnly = list.filter(
            (p) => p?.featured && !(p?.oldPrice > p?.price)
        );
        return [...discounted, ...featuredOnly].slice(0, MAX_SLIDES);
    }, [products]);

    const count = slides.length;

    useEffect(() => {
        setIndex(0);
    }, [slides]);

    useEffect(() => {
        if (paused || count <= 1) return undefined;
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % count);
        }, INTERVAL_MS);
        return () => clearInterval(id);
    }, [paused, count]);

    if (count === 0) {
        return null;
    }

    const goTo = (i) => setIndex(((i % count) + count) % count);
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    const onTouchStart = (e) => {
        touchX.current = e.touches[0].clientX;
    };

    const onTouchEnd = (e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) {
            if (dx < 0) next();
            else prev();
        }
        touchX.current = null;
    };

    const handleAdd = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        toast.success(`${product.name} savatga qo'shildi!`);
        setTimeout(() => setAdded(false), 800);
    };

    return (
        <div
            className="hero-carousel"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-roledescription="karusel"
        >
            <div className="carousel-header">
                <span className="carousel-title">{'\u{1F525}'} Bugungi skidkalar</span>
                <div className="carousel-dots" role="tablist">
                    {slides.map((slide, i) => (
                        <button
                            key={slide._id || slide.id || i}
                            className={`carousel-dot ${i === index ? 'active' : ''}`}
                            onClick={() => goTo(i)}
                            role="tab"
                            aria-selected={i === index}
                            aria-label={`Slayd ${i + 1}: ${slide.name}`}
                        />
                    ))}
                </div>
            </div>

            <div className="carousel-viewport">
                <button className="carousel-arrow prev" onClick={prev} aria-label="Oldingi slayd">
                    <FiChevronLeft />
                </button>
                <button className="carousel-arrow next" onClick={next} aria-label="Keyingi slayd">
                    <FiChevronRight />
                </button>

                {slides.map((slide, i) => {
                    const pid = slide._id || slide.id;
                    const discount =
                        slide._discount ||
                        (slide.oldPrice > slide.price
                            ? Math.round((1 - slide.price / slide.oldPrice) * 100)
                            : 0);

                    return (
                        <div
                            key={pid || i}
                            className={`carousel-slide ${i === index ? 'active' : ''}`}
                            aria-hidden={i !== index}
                        >
                            <Link
                                to={`/product/${pid}`}
                                className="slide-media"
                                aria-label={slide.name}
                            >
                                {discount > 0 && (
                                    <span className="slide-discount">-{discount}%</span>
                                )}
                                <img
                                    src={getImageUrl(slide.image)}
                                    alt={slide.name}
                                    loading={i === 0 ? 'eager' : 'lazy'}
                                />
                            </Link>

                            <div className="slide-info">
                                <Link to={`/product/${pid}`} className="slide-name">
                                    {slide.name}
                                </Link>
                                <div className="slide-bottom">
                                    <div className="slide-prices">
                                        <span className="slide-price">
                                            {formatPrice(slide.price)}
                                        </span>
                                        {slide.oldPrice > slide.price && (
                                            <span className="slide-old-price">
                                                {formatPrice(slide.oldPrice)}
                                            </span>
                                        )}
                                    </div>
                                    <button
                                        className={`slide-add ${added ? 'added' : ''}`}
                                        onClick={(e) => handleAdd(e, slide)}
                                        aria-label={`${slide.name} savatga qo'shish`}
                                    >
                                        {added ? <FiCheck /> : <FiShoppingCart />}
                                        <span>{added ? "Qo'shildi" : 'Savatga'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HeroCarousel;

