import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiEye, FiImage, FiHeart, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, getImageUrl } from '../data/products';
import './ProductCard.css';

const ProductCard = ({ product, viewMode = 'grid' }) => {
    const { addToCart, isInCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const toast = useToast();
    const [imageError, setImageError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const productId = product._id || product.id;
    const inCart = isInCart(productId);
    const inWishlist = isInWishlist(productId);

    // Generate product code for display
    const getProductCode = () => {
        if (typeof productId === 'string' && productId.length > 6) {
            return '#' + productId.slice(-4).toUpperCase();
        }
        return '#' + String(productId).padStart(3, '0');
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsAdding(true);
        addToCart(product);
        toast.success(`${product.name} savatga qo'shildi!`);
        setTimeout(() => setIsAdding(false), 500);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(productId);
            toast.info('Istaklar ro\'yxatidan olib tashlandi');
        } else {
            addToWishlist(product);
            toast.success('Istaklar ro\'yxatiga qo\'shildi!');
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const productImageUrl = () => {
        if (!product.image || imageError) {
            return null;
        }
        return getImageUrl(product.image);
    };

    return (
        <Link to={`/product/${productId}`} className={`product-card ${viewMode === 'list' ? 'list-view' : ''}`}>
            {/* Badge */}
            {product.discount && (
                <span className="product-badge sale">
                    -{product.discount}%
                </span>
            )}
            {product.featured && !product.discount && (
                <span className="product-badge featured">
                    Mashhur
                </span>
            )}
            {product.stockCount === 0 && (
                <span className="product-badge out-of-stock">
                    Tugadi
                </span>
            )}

            {/* Wishlist Button */}
            <button
                className={`wishlist-btn ${inWishlist ? 'active' : ''}`}
                onClick={handleToggleWishlist}
                title={inWishlist ? 'Istaklar ro\'yxatidan olib tashlash' : 'Istaklar ro\'yxatiga qo\'shish'}
            >
                <FiHeart />
            </button>

            {/* Image */}
            <div className="product-image">
                {!imageError && product.image ? (
                    <img
                        src={productImageUrl()}
                        alt={product.name}
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <div className="image-placeholder">
                        <FiImage className="placeholder-icon" />
                        <span>Rasm yo'q</span>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="product-actions">
                    <button
                        className="action-btn view-btn"
                        onClick={(e) => e.stopPropagation()}
                        title="Ko'rish"
                    >
                        <FiEye />
                    </button>
                    <button
                        className={`action-btn cart-action-btn ${isAdding ? 'adding' : ''}`}
                        onClick={handleAddToCart}
                        disabled={product.stockCount === 0}
                        title="Savatga qo'shish"
                    >
                        {isAdding ? <FiCheck /> : <FiShoppingCart />}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>

                {/* Rating */}
                <div className="product-rating">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <FiStar
                                key={i}
                                className={`star ${i < Math.floor(product.rating || 4) ? 'filled' : ''}`}
                            />
                        ))}
                    </div>
                    <span className="rating-count">({product.reviews || 0})</span>
                </div>

                {/* Price */}
                <div className="product-price-row">
                    <div className="product-price">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.oldPrice && (
                            <span className="old-price">{formatPrice(product.oldPrice)}</span>
                        )}
                    </div>
                    <button
                        className={`add-to-cart-btn ${inCart ? 'in-cart' : ''} ${isAdding ? 'adding' : ''}`}
                        onClick={handleAddToCart}
                        disabled={product.stockCount === 0}
                    >
                        {isAdding ? (
                            <FiCheck />
                        ) : inCart ? (
                            <>
                                <FiCheck />
                                <span>Savatda</span>
                            </>
                        ) : (
                            <>
                                <FiShoppingCart />
                                <span>Qo'shish</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
