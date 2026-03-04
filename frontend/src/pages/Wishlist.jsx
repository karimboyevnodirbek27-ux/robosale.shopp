import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingCart, FiHeart, FiArrowRight } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, getImageUrl } from '../data/products';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();
    const toast = useToast();

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success(`${product.name} savatga qo'shildi!`);
    };

    const handleRemove = (product) => {
        removeFromWishlist(product._id || product.id);
        toast.info('Mahsulot olib tashlandi');
    };

    const handleAddAllToCart = () => {
        wishlistItems.forEach(item => addToCart(item));
        toast.success('Barcha mahsulotlar savatga qo\'shildi!');
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="wishlist-page">
                <div className="container">
                    <div className="empty-wishlist">
                        <FiHeart className="empty-icon" />
                        <h2>Istaklar ro'yxati bo'sh</h2>
                        <p>Yoqtirgan mahsulotlaringizni bu yerga qo'shing</p>
                        <Link to="/products" className="btn btn-primary">
                            Mahsulotlarni ko'rish
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-page">
            <div className="container">
                <div className="wishlist-header">
                    <div>
                        <h1>
                            <FiHeart className="header-icon" />
                            Istaklar ro'yxati
                        </h1>
                        <span className="wishlist-count">{wishlistItems.length} ta mahsulot</span>
                    </div>
                    <div className="wishlist-actions">
                        <button className="btn btn-secondary" onClick={handleAddAllToCart}>
                            <FiShoppingCart />
                            Barchasini savatga
                        </button>
                        <button className="clear-wishlist-btn" onClick={clearWishlist}>
                            <FiTrash2 />
                            Tozalash
                        </button>
                    </div>
                </div>

                <div className="wishlist-grid">
                    {wishlistItems.map(item => (
                        <div key={item._id || item.id} className="wishlist-item">
                            <Link to={`/product/${item._id || item.id}`} className="item-image">
                                <img
                                    src={getImageUrl(item.image)}
                                    alt={item.name}
                                    onError={(e) => {
                                        e.target.src = '/placeholder.svg';
                                    }}
                                />
                            </Link>

                            <div className="item-info">
                                <span className="item-category">{item.category}</span>
                                <Link to={`/product/${item._id || item.id}`} className="item-name">
                                    {item.name}
                                </Link>
                                <div className="item-price">
                                    <span className="current-price">{formatPrice(item.price)}</span>
                                    {item.oldPrice && (
                                        <span className="old-price">{formatPrice(item.oldPrice)}</span>
                                    )}
                                </div>
                            </div>

                            <div className="item-actions">
                                <button
                                    className="btn btn-primary add-cart-btn"
                                    onClick={() => handleAddToCart(item)}
                                >
                                    <FiShoppingCart />
                                    Savatga
                                </button>
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemove(item)}
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="wishlist-footer">
                    <Link to="/products" className="continue-link">
                        <FiArrowRight />
                        Xaridni davom ettirish
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
