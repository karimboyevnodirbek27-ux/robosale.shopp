import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiCheck, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductDetailSkeleton } from '../components/Skeleton';
import { formatPrice, getImageUrl } from '../data/products';
import { apiFetch } from '../lib/api';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    const { addToCart, isInCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const toast = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await apiFetch(`/products/${id}`);
                const data = await response.json();

                if (data.success) {
                    setProduct(data.product);
                } else {
                    throw new Error(data.message);
                }
            } catch (err) {
                // Try fallback to local data
                try {
                    const { products } = await import('../data/products');
                    const localProduct = products.find(p => p.id === parseInt(id) || p.id === id);
                    if (localProduct) {
                        setProduct(localProduct);
                    } else {
                        setError('Mahsulot topilmadi');
                    }
                } catch {
                    setError('Mahsulot topilmadi');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        toast.success(`${product.name} savatga qo'shildi!`);
    };

    const handleToggleWishlist = () => {
        const productId = product._id || product.id;
        if (isInWishlist(productId)) {
            removeFromWishlist(productId);
            toast.info('Istaklar ro\'yxatidan olib tashlandi');
        } else {
            addToWishlist(product);
            toast.success('Istaklar ro\'yxatiga qo\'shildi!');
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: product.name,
                text: product.description,
                url: window.location.href
            });
        } catch {
            navigator.clipboard.writeText(window.location.href);
            toast.info('Havola nusxa olindi!');
        }
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <ProductDetailSkeleton />
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-page">
                <div className="container">
                    <div className="error-state">
                        <h2>😕 {error || 'Mahsulot topilmadi'}</h2>
                        <Link to="/products" className="btn btn-primary">
                            Mahsulotlarga qaytish
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const productId = product._id || product.id;
    const inCart = isInCart(productId);
    const inWishlist = isInWishlist(productId);

    // Filter out null images and get valid URLs
    // Check if images array has items, otherwise use single image
    const rawImages = (product.images && product.images.length > 0)
        ? product.images
        : (product.image ? [product.image] : []);

    const images = rawImages
        .map(img => getImageUrl(img))
        .filter(img => img !== null && img !== undefined);

    // Debug log - o'chirib tashlash mumkin keyinroq
    console.log('Product image debug:', {
        'product.image': product.image,
        'product.images': product.images,
        'rawImages': rawImages,
        'processedImages': images
    });

    // If no valid images, use placeholder
    const displayImages = images.length > 0 ? images : ['/placeholder.svg'];

    return (
        <div className="product-detail-page">
            <div className="container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Bosh sahifa</Link>
                    <span>/</span>
                    <Link to="/products">Mahsulotlar</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </nav>

                <div className="product-detail-grid">
                    {/* Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            <img
                                src={displayImages[selectedImage] || displayImages[0]}
                                alt={product.name}
                                onError={(e) => {
                                    e.target.src = '/placeholder.svg';
                                }}
                            />
                            {product.stockCount === 0 && (
                                <div className="out-of-stock-badge">Tugadi</div>
                            )}
                        </div>
                        {displayImages.length > 1 && (
                            <div className="thumbnail-list">
                                {displayImages.map((img, index) => (
                                    <button
                                        key={index}
                                        className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={img} alt={`${product.name} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="product-info">
                        <span className="product-category">{product.category}</span>
                        <h1 className="product-title">{product.name}</h1>

                        {/* Rating */}
                        <div className="product-rating">
                            <div className="stars">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span
                                        key={star}
                                        className={star <= Math.floor(product.rating || 4.5) ? 'filled' : ''}
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <span className="rating-value">{product.rating || 4.5}</span>
                            <span className="review-count">({product.reviews || 12} ta sharh)</span>
                        </div>

                        {/* Price */}
                        <div className="product-price-block">
                            <span className="current-price">{formatPrice(product.price)}</span>
                            {product.oldPrice && (
                                <>
                                    <span className="old-price">{formatPrice(product.oldPrice)}</span>
                                    <span className="discount-badge">
                                        -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Stock */}
                        <div className={`stock-status ${product.stockCount > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {product.stockCount > 0 ? (
                                <>
                                    <FiCheck /> Omborda mavjud ({product.stockCount} dona)
                                </>
                            ) : (
                                'Omborda yo\'q'
                            )}
                        </div>

                        {/* Description */}
                        <p className="product-description">{product.description}</p>

                        {/* Features */}
                        {product.features && (
                            <div className="product-features">
                                <h4>Xususiyatlari:</h4>
                                <ul>
                                    {product.features.map((feature, index) => (
                                        <li key={index}>
                                            <FiCheck /> {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="product-actions">
                            <div className="quantity-selector">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                >
                                    <FiMinus />
                                </button>
                                <span>{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(product.stockCount || 10, q + 1))}
                                    disabled={quantity >= (product.stockCount || 10)}
                                >
                                    <FiPlus />
                                </button>
                            </div>

                            <button
                                className={`btn btn-primary add-to-cart ${inCart ? 'in-cart' : ''}`}
                                onClick={handleAddToCart}
                                disabled={product.stockCount === 0}
                            >
                                <FiShoppingCart />
                                {inCart ? 'Yana qo\'shish' : 'Savatga qo\'shish'}
                            </button>

                            <button
                                className={`btn-icon wishlist-btn ${inWishlist ? 'active' : ''}`}
                                onClick={handleToggleWishlist}
                            >
                                <FiHeart />
                            </button>

                            <button className="btn-icon" onClick={handleShare}>
                                <FiShare2 />
                            </button>
                        </div>

                        {/* Guarantees */}
                        <div className="product-guarantees">
                            <div className="guarantee-item">
                                <FiTruck />
                                <div>
                                    <strong>Tezkor yetkazish</strong>
                                    <span>Beruniy tumanida 1 kun, viloyatlarga 1-2 kun</span>
                                </div>
                            </div>
                            <div className="guarantee-item">
                                <FiShield />
                                <div>
                                    <strong>Kafolat</strong>
                                    <span>12 oy rasmiy kafolat</span>
                                </div>
                            </div>
                            <div className="guarantee-item">
                                <FiRefreshCw />
                                <div>
                                    <strong>14 kun ichida qaytarish</strong>
                                    <span>Hech qanday savol yo'q</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
