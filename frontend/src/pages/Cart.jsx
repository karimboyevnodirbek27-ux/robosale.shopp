import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowLeft, FiShoppingBag, FiSend } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../data/products';
import './Cart.css';

// Telegram username
const TELEGRAM_USERNAME = 'Karimboyev_Nodirbek';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

    // Generate product ID for display
    const getProductCode = (item) => {
        const id = item._id || item.id;
        if (typeof id === 'string' && id.length > 6) {
            return '#' + id.slice(-4).toUpperCase();
        }
        return '#' + String(id).padStart(3, '0');
    };

    // Create Telegram order message
    const createTelegramMessage = () => {
        let message = '🛒 Yangi buyurtma!\n\n';
        message += 'Mahsulotlar:\n';

        cartItems.forEach(item => {
            const code = getProductCode(item);
            message += `${code}: ${item.name} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}\n`;
        });

        message += `\n💰 Jami: ${formatPrice(getTotalPrice())}`;
        message += '\n\n📞 Iltimos, bog\'laning!';

        return encodeURIComponent(message);
    };

    // Handle Telegram order
    const handleTelegramOrder = () => {
        const message = createTelegramMessage();
        const telegramUrl = `https://t.me/${TELEGRAM_USERNAME}?text=${message}`;
        window.open(telegramUrl, '_blank');
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <FiShoppingBag className="empty-icon" />
                        <h2>Savatcha bo'sh</h2>
                        <p>Hali hech narsa qo'shmagansiz</p>
                        <Link to="/products" className="btn btn-primary">
                            Xarid qilishni boshlash
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Savatcha</h1>
                    <button className="clear-cart-btn" onClick={clearCart}>
                        <FiTrash2 />
                        Barchasini o'chirish
                    </button>
                </div>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map(item => {
                            const itemId = item._id || item.id;
                            return (
                                <div key={itemId} className="cart-item">
                                    <div className="item-image">
                                        <span className="item-code">{getProductCode(item)}</span>
                                        <img src={getImageUrl(item.image)} alt={item.name} />
                                    </div>

                                    <div className="item-details">
                                        <Link to={`/product/${itemId}`} className="item-name">
                                            {item.name}
                                        </Link>
                                        <span className="item-category">{item.category}</span>
                                    </div>

                                    <div className="item-quantity">
                                        <button onClick={() => updateQuantity(itemId, item.quantity - 1)}>
                                            <FiMinus />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(itemId, item.quantity + 1)}>
                                            <FiPlus />
                                        </button>
                                    </div>

                                    <div className="item-price">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(itemId)}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    <div className="cart-summary">
                        <h3>Buyurtma xulosasi</h3>

                        <div className="summary-row">
                            <span>Mahsulotlar ({cartItems.length})</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                        </div>

                        <div className="summary-row">
                            <span>Yetkazib berish</span>
                            <span className="free">Bepul</span>
                        </div>

                        <div className="summary-total">
                            <span>Jami</span>
                            <span>{formatPrice(getTotalPrice())}</span>
                        </div>

                        <button onClick={handleTelegramOrder} className="btn btn-primary checkout-btn telegram-btn">
                            <FiSend />
                            Telegramga buyurtma berish
                        </button>

                        <div className="telegram-note">
                            <span>💬</span>
                            <span>@{TELEGRAM_USERNAME} ga avtomatik yuboriladi</span>
                        </div>

                        <Link to="/products" className="continue-shopping">
                            <FiArrowLeft />
                            Xaridni davom ettirish
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
