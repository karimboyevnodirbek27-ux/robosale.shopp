import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiPackage, FiTruck, FiCheck, FiClock } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import './OrderTracking.css';

const API_URL = 'http://localhost:5000/api';

const OrderTracking = () => {
    const [orderNumber, setOrderNumber] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const toast = useToast();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) {
            toast.error('Buyurtma raqamini kiriting');
            return;
        }

        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const response = await fetch(`${API_URL}/orders/track/${orderNumber}`);
            const data = await response.json();

            if (data.success) {
                setOrder(data.order);
                toast.success('Buyurtma topildi!');
            } else {
                setError('Buyurtma topilmadi. Raqamni tekshiring.');
                toast.error('Buyurtma topilmadi');
            }
        } catch (err) {
            setError('Server bilan aloqa yo\'q. Keyinroq urinib ko\'ring.');
            toast.error('Xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['pending', 'processing', 'shipped', 'delivered'];
        return steps.indexOf(status) + 1;
    };

    const getStatusText = (status) => {
        const texts = {
            pending: 'Kutilmoqda',
            processing: 'Tayyorlanmoqda',
            shipped: 'Yo\'lda',
            delivered: 'Yetkazildi',
            cancelled: 'Bekor qilindi'
        };
        return texts[status] || status;
    };

    const getPaymentStatusText = (status) => {
        const texts = {
            pending: 'To\'lanmagan',
            paid: 'To\'langan',
            failed: 'Xatolik'
        };
        return texts[status] || status;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ').format(price) + ' so\'m';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="order-tracking-page">
            <div className="container">
                <div className="tracking-header">
                    <h1>Buyurtmani kuzatish</h1>
                    <p>Buyurtma raqamingizni kiriting va holatini bilib oling</p>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-input-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buyurtma raqami (masalan: RB123456)"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Qidirilmoqda...' : 'Qidirish'}
                    </button>
                </form>

                {error && (
                    <div className="error-message">
                        <p>⚠️ {error}</p>
                    </div>
                )}

                {order && (
                    <div className="order-result animate-fadeIn">
                        <div className="order-card">
                            <div className="order-header">
                                <div className="order-number">
                                    <FiPackage />
                                    <span>#{order.orderNumber}</span>
                                </div>
                                <div className={`order-status status-${order.orderStatus}`}>
                                    {getStatusText(order.orderStatus)}
                                </div>
                            </div>

                            {/* Status Timeline */}
                            <div className="status-timeline">
                                <div className={`timeline-step ${getStatusStep(order.orderStatus) >= 1 ? 'completed' : ''}`}>
                                    <div className="step-icon">
                                        <FiClock />
                                    </div>
                                    <div className="step-info">
                                        <span className="step-title">Qabul qilindi</span>
                                        <span className="step-desc">Buyurtma qabul qilindi</span>
                                    </div>
                                </div>

                                <div className={`timeline-step ${getStatusStep(order.orderStatus) >= 2 ? 'completed' : ''}`}>
                                    <div className="step-icon">
                                        <FiPackage />
                                    </div>
                                    <div className="step-info">
                                        <span className="step-title">Tayyorlanmoqda</span>
                                        <span className="step-desc">Buyurtma yig'ilmoqda</span>
                                    </div>
                                </div>

                                <div className={`timeline-step ${getStatusStep(order.orderStatus) >= 3 ? 'completed' : ''}`}>
                                    <div className="step-icon">
                                        <FiTruck />
                                    </div>
                                    <div className="step-info">
                                        <span className="step-title">Yo'lda</span>
                                        <span className="step-desc">Kuryer yo'lda</span>
                                    </div>
                                </div>

                                <div className={`timeline-step ${getStatusStep(order.orderStatus) >= 4 ? 'completed' : ''}`}>
                                    <div className="step-icon">
                                        <FiCheck />
                                    </div>
                                    <div className="step-info">
                                        <span className="step-title">Yetkazildi</span>
                                        <span className="step-desc">Buyurtma topshirildi</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="order-details">
                                <div className="detail-item">
                                    <span className="detail-label">To'lov holati</span>
                                    <span className={`detail-value payment-${order.paymentStatus}`}>
                                        {getPaymentStatusText(order.paymentStatus)}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Jami summa</span>
                                    <span className="detail-value total">{formatPrice(order.totalAmount)}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Buyurtma sanasi</span>
                                    <span className="detail-value">{formatDate(order.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="tracking-actions">
                            <Link to="/contact" className="btn btn-secondary">
                                Yordam olish
                            </Link>
                            <Link to="/products" className="btn btn-primary">
                                Xarid qilishda davom etish
                            </Link>
                        </div>
                    </div>
                )}

                {!order && !error && !loading && (
                    <div className="tracking-info">
                        <div className="info-card">
                            <h3>Buyurtma raqamini qaerdan topaman?</h3>
                            <ul>
                                <li>📧 Email xabaringizda</li>
                                <li>📱 SMS xabaringizda</li>
                                <li>✅ Buyurtma berilgandan keyin ekrandagi raqam</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
