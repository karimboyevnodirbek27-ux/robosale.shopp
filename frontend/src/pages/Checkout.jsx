import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, getImageUrl } from '../data/products';
import { apiFetch } from '../lib/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getTotalPrice, clearCart } = useCart();
    const toast = useToast();
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        city: 'Toshkent',
        address: '',
        notes: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'Ism kiritilishi shart';
        if (!formData.lastName.trim()) newErrors.lastName = 'Familiya kiritilishi shart';
        if (!formData.phone.trim()) newErrors.phone = 'Telefon kiritilishi shart';
        if (formData.phone && !/^\+?[0-9]{9,13}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Telefon raqami noto\'g\'ri';
        }
        if (!formData.address.trim()) newErrors.address = 'Manzil kiritilishi shart';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Iltimos, barcha maydonlarni to\'ldiring');
            return;
        }

        setIsSubmitting(true);

        try {
            // Faqat serverga kerakli ma'lumot yuboriladi.
            // Narxlar serverda qayta hisoblanadi, shuning uchun price yuborilmaydi.
            const orderData = {
                items: cartItems.map(item => ({
                    product: item._id || item.id,
                    quantity: item.quantity
                })),
                shippingAddress: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    email: formData.email,
                    city: formData.city,
                    address: formData.address,
                    notes: formData.notes
                },
                paymentMethod
            };

            const response = await apiFetch('/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
                timeoutMs: 40000
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Buyurtma yuborilmadi');
            }

            setOrderNumber(data.order.orderNumber);
            setOrderComplete(true);
            clearCart();
            toast.success('Buyurtma muvaffaqiyatli qabul qilindi!');
        } catch (error) {
            console.error('Order error:', error);
            // Backend xato bersa, soxta muvaffaqiyat ko'rsatmaymiz.
            toast.error(error.message || 'Buyurtma yuborishda xatolik yuz berdi');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderComplete) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="order-success">
                        <div className="success-icon">
                            <FiCheck />
                        </div>
                        <h2>Buyurtma qabul qilindi!</h2>
                        <p className="order-number">Buyurtma raqami: <strong>#{orderNumber}</strong></p>
                        <p>Tez orada operator siz bilan bog'lanadi.</p>
                        <div className="success-actions">
                            <button className="btn btn-primary" onClick={() => navigate('/')}>
                                Bosh sahifaga qaytish
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/order-tracking')}>
                                Buyurtmani kuzatish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        navigate('/cart');
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Buyurtma berish</h1>

                <form onSubmit={handleSubmit} className="checkout-layout">
                    <div className="checkout-form">
                        {/* Contact Info */}
                        <div className="form-section">
                            <h3>👤 Aloqa ma'lumotlari</h3>
                            <div className="form-grid">
                                <div className={`input-group ${errors.firstName ? 'error' : ''}`}>
                                    <label>Ism *</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        placeholder="Ismingizni kiriting"
                                    />
                                    {errors.firstName && <span className="error-text"><FiAlertCircle /> {errors.firstName}</span>}
                                </div>
                                <div className={`input-group ${errors.lastName ? 'error' : ''}`}>
                                    <label>Familiya *</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Familiyangizni kiriting"
                                    />
                                    {errors.lastName && <span className="error-text"><FiAlertCircle /> {errors.lastName}</span>}
                                </div>
                                <div className={`input-group ${errors.phone ? 'error' : ''}`}>
                                    <label>Telefon *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="+998 90 123 45 67"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />
                                    {errors.phone && <span className="error-text"><FiAlertCircle /> {errors.phone}</span>}
                                </div>
                                <div className="input-group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="email@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="form-section">
                            <h3>🚚 Yetkazib berish manzili</h3>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Shahar *</label>
                                    <select name="city" value={formData.city} onChange={handleInputChange}>
                                        <option value="Toshkent">Toshkent</option>
                                        <option value="Samarqand">Samarqand</option>
                                        <option value="Buxoro">Buxoro</option>
                                        <option value="Namangan">Namangan</option>
                                        <option value="Andijon">Andijon</option>
                                        <option value="Fargona">Farg'ona</option>
                                        <option value="Qoraqalpogiston">Qoraqalpog'iston</option>
                                        <option value="Xorazm">Xorazm</option>
                                        <option value="Navoiy">Navoiy</option>
                                        <option value="Jizzax">Jizzax</option>
                                        <option value="Sirdaryo">Sirdaryo</option>
                                        <option value="Qashqadaryo">Qashqadaryo</option>
                                        <option value="Surxondaryo">Surxondaryo</option>
                                    </select>
                                </div>
                                <div className={`input-group full-width ${errors.address ? 'error' : ''}`}>
                                    <label>Manzil *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Ko'cha, uy, xonadon"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                    />
                                    {errors.address && <span className="error-text"><FiAlertCircle /> {errors.address}</span>}
                                </div>
                                <div className="input-group full-width">
                                    <label>Qo'shimcha izoh</label>
                                    <textarea
                                        name="notes"
                                        rows="3"
                                        placeholder="Kuryer uchun izoh..."
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="form-section">
                            <h3>💳 To'lov usuli</h3>
                            <div className="payment-methods">
                                <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cash"
                                        checked={paymentMethod === 'cash'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <div className="payment-content">
                                        <span className="payment-icon">💵</span>
                                        <span>Naqd pul (yetkazib berishda)</span>
                                    </div>
                                </label>

                                <label className="payment-option disabled">
                                    <input type="radio" name="payment" value="payme" disabled />
                                    <div className="payment-content">
                                        <div className="payment-logo payme">Payme</div>
                                        <span>Karta orqali to'lash</span>
                                        <small className="coming-soon-label">Tez orada</small>
                                    </div>
                                </label>

                                <label className="payment-option disabled">
                                    <input type="radio" name="payment" value="click" disabled />
                                    <div className="payment-content">
                                        <div className="payment-logo click">Click</div>
                                        <span>Karta orqali to'lash</span>
                                        <small className="coming-soon-label">Tez orada</small>
                                    </div>
                                </label>

                                <label className="payment-option disabled">
                                    <input type="radio" name="payment" value="installment" disabled />
                                    <div className="payment-content">
                                        <span className="payment-icon">📅</span>
                                        <span>Bo'lib to'lash</span>
                                        <small className="coming-soon-label">Tez orada</small>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="order-summary">
                        <h3>📦 Buyurtma</h3>

                        <div className="order-items">
                            {cartItems.map(item => (
                                <div key={item._id || item.id} className="order-item">
                                    <div className="order-item-image">
                                        <img src={getImageUrl(item.image)} alt={item.name} />
                                        <span className="quantity-badge">{item.quantity}</span>
                                    </div>
                                    <div className="order-item-info">
                                        <span className="order-item-name">{item.name}</span>
                                        <span className="order-item-price">{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="order-totals">
                            <div className="total-row">
                                <span>Mahsulotlar ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} ta)</span>
                                <span>{formatPrice(getTotalPrice())}</span>
                            </div>
                            <div className="total-row">
                                <span>Yetkazib berish</span>
                                <span className="free">Bepul</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Jami</span>
                                <span>{formatPrice(getTotalPrice())}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary submit-order"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Buyurtma berilmoqda...
                                </>
                            ) : (
                                <>
                                    <FiCreditCard />
                                    Buyurtma berish
                                </>
                            )}
                        </button>

                        <p className="secure-note">
                            🔒 Sizning ma'lumotlaringiz xavfsiz saqlanadi
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
